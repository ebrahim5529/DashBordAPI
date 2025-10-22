import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/hoc/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';

// Public pages - Eager loading (no lazy)
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import TestConnection from '@/pages/TestConnection';

// Contract Sign - Eager loading
import ContractSign from '@/pages/ContractSign';

// Dashboard pages - Eager loading للصفحات الأساسية (لا وميض)
import DashboardHome from '@/pages/dashboard/DashboardHome';
import CustomerManagement from '@/pages/dashboard/CustomerManagement';
import ContractManagement from '@/pages/dashboard/ContractManagement';
import InventoryStatus from '@/pages/dashboard/InventoryStatus';
import PaymentManagement from '@/pages/dashboard/PaymentManagement';
import EmployeeManagement from '@/pages/dashboard/EmployeeManagement';
import ActiveContracts from '@/pages/dashboard/ActiveContracts';
import DeliveryOrders from '@/pages/dashboard/DeliveryOrders';
import Profile from '@/pages/dashboard/Profile';
import Settings from '@/pages/dashboard/Settings';
import ContractDetails from '@/pages/dashboard/ContractDetails';

// جميع صفحات Dashboard - Eager loading (لا وميض!)
import DashboardInteractive from '@/pages/dashboard/DashboardInteractive';
import OperationsReports from '@/pages/dashboard/OperationsReports';
import CustomerReports from '@/pages/dashboard/CustomerReports';
import CustomerContracts from '@/pages/dashboard/CustomerContracts';
import CustomerClaims from '@/pages/dashboard/CustomerClaims';
import SupplierManagement from '@/pages/dashboard/SupplierManagement';
import SupplierInvoices from '@/pages/dashboard/SupplierInvoices';
import SupplierPurchases from '@/pages/dashboard/SupplierPurchases';
import PurchaseEquipment from '@/pages/dashboard/PurchaseEquipment';
import PurchasesList from '@/pages/dashboard/PurchasesList';
import ExpiredContracts from '@/pages/dashboard/ExpiredContracts';
import CancelledContracts from '@/pages/dashboard/CancelledContracts';
import ElectronicSignature from '@/pages/dashboard/ElectronicSignature';
import DeliveryOrdersDetails from '@/pages/dashboard/DeliveryOrdersDetails';
import ShippingTracking from '@/pages/dashboard/ShippingTracking';
import DeliveryReceipt from '@/pages/dashboard/DeliveryReceipt';
import ReturnInspection from '@/pages/dashboard/ReturnInspection';
import PurchaseManagement from '@/pages/dashboard/PurchaseManagement';
import Invoices from '@/pages/dashboard/Invoices';
import FinancialReports from '@/pages/dashboard/FinancialReports';
import Salaries from '@/pages/dashboard/Salaries';
import Incentives from '@/pages/dashboard/Incentives';
import Attendance from '@/pages/dashboard/Attendance';
import Departments from '@/pages/dashboard/Departments';
import Leaves from '@/pages/dashboard/Leaves';
import UserRoles from '@/pages/dashboard/UserRoles';
import PermissionGroups from '@/pages/dashboard/PermissionGroups';
import AccessControl from '@/pages/dashboard/AccessControl';
import SecuritySettings from '@/pages/dashboard/SecuritySettings';
import AuditTrail from '@/pages/dashboard/AuditTrail';
import LoginMonitoring from '@/pages/dashboard/LoginMonitoring';
import InstallmentPlans from '@/pages/dashboard/InstallmentPlans';
import PaymentSchedules from '@/pages/dashboard/PaymentSchedules';
import InstallmentTracking from '@/pages/dashboard/InstallmentTracking';
import LatePayments from '@/pages/dashboard/LatePayments';
import PaymentMethods from '@/pages/dashboard/PaymentMethods';
import InstallmentReports from '@/pages/dashboard/InstallmentReports';
import DeliveryOrderDetails from '@/pages/dashboard/DeliveryOrderDetails';
import Security from '@/pages/dashboard/Security';
import ActivityLog from '@/pages/dashboard/ActivityLog';

/**
 * مكون التوجيه الرئيسي للتطبيق
 */
export default function AppRoutes() {
  return (
    <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contract/sign/:contractNumber" element={<ContractSign />} />
        <Route path="/test-connection" element={<TestConnection />} />

        {/* Protected Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="dashboard-interactive" element={<DashboardInteractive />} />
          <Route path="main-dashboard" element={<DashboardHome />} />
          <Route path="operations-reports" element={<OperationsReports />} />
          <Route path="customer-reports" element={<CustomerReports />} />
          <Route path="customer-management" element={<CustomerManagement />} />
          <Route path="customer-contracts" element={<CustomerContracts />} />
          <Route path="customer-claims" element={<CustomerClaims />} />
          <Route path="supplier-management" element={<SupplierManagement />} />
          <Route path="supplier-invoices" element={<SupplierInvoices />} />
          <Route path="supplier-purchases" element={<SupplierPurchases />} />
          <Route path="inventory-status" element={<InventoryStatus />} />
          <Route path="purchase-equipment" element={<PurchaseEquipment />} />
          <Route path="purchases-list" element={<PurchasesList />} />
          <Route path="contract-management" element={<ContractManagement />} />
          <Route path="active-contracts" element={<ActiveContracts />} />
          <Route path="expired-contracts" element={<ExpiredContracts />} />
          <Route path="cancelled-contracts" element={<CancelledContracts />} />
          <Route path="electronic-signature" element={<ElectronicSignature />} />
          <Route path="delivery-orders" element={<DeliveryOrders />} />
          <Route path="delivery-orders-details" element={<DeliveryOrdersDetails />} />
          <Route path="shipping-tracking" element={<ShippingTracking />} />
          <Route path="delivery-receipt" element={<DeliveryReceipt />} />
          <Route path="return-inspection" element={<ReturnInspection />} />
          <Route path="payment-management" element={<PaymentManagement />} />
          <Route path="purchase-management" element={<PurchaseManagement />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="financial-reports" element={<FinancialReports />} />
          <Route path="employee-management" element={<EmployeeManagement />} />
          <Route path="salaries" element={<Salaries />} />
          <Route path="incentives" element={<Incentives />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="departments" element={<Departments />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="user-roles" element={<UserRoles />} />
          <Route path="permission-groups" element={<PermissionGroups />} />
          <Route path="access-control" element={<AccessControl />} />
          <Route path="security-settings" element={<SecuritySettings />} />
          <Route path="audit-trail" element={<AuditTrail />} />
          <Route path="login-monitoring" element={<LoginMonitoring />} />
          <Route path="installment-plans" element={<InstallmentPlans />} />
          <Route path="payment-schedules" element={<PaymentSchedules />} />
          <Route path="installment-tracking" element={<InstallmentTracking />} />
          <Route path="late-payments" element={<LatePayments />} />
          <Route path="payment-methods" element={<PaymentMethods />} />
          <Route path="installment-reports" element={<InstallmentReports />} />
          <Route path="contract-details/:id" element={<ContractDetails />} />
          <Route path="delivery-order-details/:id" element={<DeliveryOrderDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="security" element={<Security />} />
          <Route path="activity-log" element={<ActivityLog />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

