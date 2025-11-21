import ApiBase from "./apiBase";
const ProjectService = {
  projectRegister: (data) => {
    return ApiBase.post("project/add", data);
  },
  getAllProject: (page, pageSize, filter) => {
    const queryParams = new URLSearchParams({
      start: page,
      length: pageSize,
      status: filter.status == "all" ? "" : filter.status,
    });
    return ApiBase.get(`project/getAll?${queryParams.toString()}`);
  },

  deleteProjectsById: (id) => {
    return ApiBase.delete(`project/delete/?id=${id}`);
  },

  getProjectsById: (id) => {
    return ApiBase.get(`project/getByid?id=${id}`);
  },

  updateProject: (id, data) => {
    return ApiBase.put(`project/update?id=${id}`, data);
  },
  getHoursLogByProject: (filter) => {
    const queryParams = new URLSearchParams({
      startDate: filter.startDate,
      endDate: filter.endDate,
      projectId: filter.projectId,
      isBillable: filter.isBillable == 3 ? "" : filter.isBillable,
    });

    return ApiBase.get(
      `project/getHoursLogByProject?${queryParams.toString()}`
    );
  },

  getHoursLogByProjectForFilter: (startDate, endDate) => {
    return ApiBase.get(
      `project/getHoursLogByProject?startDate=${startDate}&endDate=${endDate}`
    );
  },
  userInProject: (id, filter) => {
    const queryParams = new URLSearchParams({
      id: id,
      startDate: filter.startDate,
      endDate: filter.endDate,
    });
    return ApiBase.get(`project/usersInProject?${queryParams.toString()}`);
  },
  userInProjectFilter: (id, dateStart, dateEnd) => {
    return ApiBase.get(
      `project/usersInProject?id=${id}&startDate=${dateStart}&endDate=${dateEnd}`
    );
  },
  projectDashboard: (id) => {
    return ApiBase.get(`project/dashboard?projectId=${id}`);
  },
};
export default ProjectService;
