import ApiClient from "./apiBase";

const EmployeeReview={
    addEmployee: (data) => {
        return ApiClient.post("/employee/createEmployee",data);
      },
      getEmployeeReview: (page,pagesize) => {
        return ApiClient.get(`/employee/allEmployee?start=${page}&length=${pagesize}`);
      },

      
      deleteEmployeeById: (id) => {
        return ApiClient.delete(`/employee/deleteEmployee?employeeId=${id}`);
      },
      updateEmployee: (id, data) => {
        return ApiClient.put(`/employee/updateEmployee?employeeId=${id}`,data);
      },
      getEmployeeById: (id) => {
        return ApiClient.get(`employee/getById?employeeId=${id}`);
      },
}
export default EmployeeReview;