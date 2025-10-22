<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UploadController extends Controller
{
    /**
     * رفع صورة
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
            'folder' => 'nullable|string',
        ], [
            'image.required' => 'الصورة مطلوبة',
            'image.image' => 'الملف يجب أن يكون صورة',
            'image.mimes' => 'نوع الصورة غير مدعوم',
            'image.max' => 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('image');
            $folder = $request->input('folder', 'images');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs($folder, $fileName, 'public');

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الصورة بنجاح',
                'data' => [
                    'path' => $path,
                    'url' => Storage::url($path),
                    'filename' => $fileName,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفع الصورة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * رفع مستند
     */
    public function uploadDocument(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
            'folder' => 'nullable|string',
        ], [
            'document.required' => 'المستند مطلوب',
            'document.file' => 'الملف غير صحيح',
            'document.mimes' => 'نوع المستند غير مدعوم',
            'document.max' => 'حجم المستند يجب أن يكون أقل من 10 ميجابايت',
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
            $folder = $request->input('folder', 'documents');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs($folder, $fileName, 'public');

            return response()->json([
                'success' => true,
                'message' => 'تم رفع المستند بنجاح',
                'data' => [
                    'path' => $path,
                    'url' => Storage::url($path),
                    'filename' => $fileName,
                ]
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
     * رفع توقيع
     */
    public function uploadSignature(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'signature' => 'required|string', // base64 string
            'filename' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $signature = $request->input('signature');
            $filename = $request->input('filename', 'signature_' . time() . '.png');
            
            // تحويل base64 إلى صورة
            $image = str_replace('data:image/png;base64,', '', $signature);
            $image = str_replace(' ', '+', $image);
            $imageData = base64_decode($image);

            $path = 'signatures/' . $filename;
            Storage::disk('public')->put($path, $imageData);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع التوقيع بنجاح',
                'data' => [
                    'path' => $path,
                    'url' => Storage::url($path),
                    'filename' => $filename,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفع التوقيع',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف ملف
     */
    public function deleteFile($path): JsonResponse
    {
        try {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);

                return response()->json([
                    'success' => true,
                    'message' => 'تم حذف الملف بنجاح'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'الملف غير موجود'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الملف',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

