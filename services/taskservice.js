import ApiClient from "./apiBase";
const TaskService = {
  getAlluserAsign: (page, pageSize) => {
    return ApiClient.get(`user/getAll?start=${page}&length=${pageSize}`);
  },


  getprojectBySlug: (id) => {
    return ApiClient.get(`project/getById?id=${id}`);
  },

  postTask: (data) => {
    return ApiClient.post("/task/add", data);
  },

  allTasks: (page, pageSize, projectId) => {
    return ApiClient.get(
      `task/getAll?start=${page}&length=${pageSize}&projectId=${projectId}`
    );
  },

  deleteTask: (id) => {
    return ApiClient.delete(`task/delete?id=${id}`);
  },

  getDataById: (id) => {
    return ApiClient.get(`/task/getById?id=${id}`);
  },
  updateTask: (id, data) => {
    return ApiClient.put(`task/update?id=${id}`, data);
  },

};

export default TaskService;
