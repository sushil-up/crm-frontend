import ApiClient from "./apiBase";
const usersService = {
  getAllUsers: (page, pageSize) => {
    return ApiClient.get(`user/getAll?start=${page}&length=${pageSize}`);
  },
  getSelectUsers: () => {
    return ApiClient.get(`/user/getSelectUsers`);
  },

  addUser: (data) => {
    return ApiClient.post("auth/register", data);
  },

  updateuser: (id, data) => {
    return ApiClient.put(`user/update?id=${id}`, data);
  },

  deleteUserById: (id) => {
    const user = ApiClient.delete(`user/delete?id=${id}`);
    return user;
  },

  getUserById: (id) => {
    const user = ApiClient.get(`user/getById?id=${id}`);
    return user;
  },
  adminAdd: (data) => {
    return ApiClient.post(`auth/globalSettingUpdate`, data);
  },

  singleUserDetails: (id , filter) => {
    const queryParams = new URLSearchParams({
      id: id,
      startDate: filter.startDate,
      endDate: filter.endDate,
    });
    return ApiClient.get(`user/projectOfUser?${queryParams.toString()}`)
  },
};

export default usersService;
