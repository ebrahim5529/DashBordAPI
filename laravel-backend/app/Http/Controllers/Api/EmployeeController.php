<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    /**
     * عرض قائمة الموظفين
     */
    public function index(Request $request): JsonResponse
    {
        $query = Employee::with('department');

        // البحث
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('employee_number', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // الفلترة حسب القسم
        if ($request->has('department_id') && $request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $employees = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    /**
     * إنشاء موظف جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:employees',
            'phone' => 'required|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'hire_date' => 'required|date',
            'id_number' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
        ], [
            'name.required' => 'الاسم مطلوب',
            'phone.required' => 'رقم الهاتف مطلوب',
            'department_id.required' => 'القسم مطلوب',
            'position.required' => 'المنصب مطلوب',
            'salary.required' => 'الراتب مطلوب',
            'hire_date.required' => 'تاريخ التعيين مطلوب',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $employeeNumber = $this->generateEmployeeNumber();

            $employee = Employee::create([
                'employee_number' => $employeeNumber,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'department_id' => $request->department_id,
                'position' => $request->position,
                'salary' => $request->salary,
                'hire_date' => $request->hire_date,
                'id_number' => $request->id_number,
                'address' => $request->address,
                'emergency_contact' => $request->emergency_contact,
                'status' => 'ACTIVE',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الموظف بنجاح',
                'data' => $employee->load('department')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء الموظف',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل موظف
     */
    public function show($id): JsonResponse
    {
        $employee = Employee::with(['department', 'documents', 'attendances', 'leaves', 'salaries'])
                           ->find($id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'الموظف غير موجود'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $employee
        ]);
    }

    /**
     * تحديث موظف
     */
    public function update(Request $request, $id): JsonResponse
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'الموظف غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:employees,email,' . $id,
            'phone' => 'required|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'status' => 'nullable|in:ACTIVE,INACTIVE,SUSPENDED',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $employee->update($request->only([
                'name', 'email', 'phone', 'department_id', 'position', 
                'salary', 'id_number', 'address', 'emergency_contact', 'status'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الموظف بنجاح',
                'data' => $employee->load('department')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الموظف',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف موظف
     */
    public function destroy($id): JsonResponse
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'الموظف غير موجود'
            ], 404);
        }

        try {
            $employee->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الموظف بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الموظف',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات الموظفين
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Employee::count(),
            'active' => Employee::where('status', 'ACTIVE')->count(),
            'inactive' => Employee::where('status', 'INACTIVE')->count(),
            'new_this_month' => Employee::whereMonth('hire_date', now()->month)
                                      ->whereYear('hire_date', now()->year)
                                      ->count(),
            'by_department' => Employee::select('department_id', DB::raw('count(*) as count'))
                                     ->groupBy('department_id')
                                     ->with('department:id,name')
                                     ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * رفع مستندات الموظف
     */
    public function uploadDocument(Request $request, $id): JsonResponse
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'الموظف غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'document' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
            'document_type' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('document');
            $fileName = 'employee_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('employees/documents', $fileName, 'public');

            $employee->documents()->create([
                'document_type' => $request->document_type,
                'file_path' => $path,
                'uploaded_by' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع المستند بنجاح',
                'data' => ['path' => $path]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفع المستند',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء رقم الموظف التلقائي
     */
    private function generateEmployeeNumber(): string
    {
        $lastEmployee = Employee::orderBy('id', 'desc')->first();
        $nextNumber = $lastEmployee ? $lastEmployee->id + 1 : 1;
        
        return 'EMP-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }
}

