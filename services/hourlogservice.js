import { tr } from "date-fns/locale";
import ApiClient from "./apiBase";
const HourLogsService = {
  getSelectProjects: () => {
    return ApiClient.get(`/project/getSelectProjects`);
  },

  getAllTask: (projectId) => {
    return ApiClient.get(`task/getAllTasksBYProjectId?id=${projectId}`);
  },
  getSelectTasks: (projectId) => {
    return ApiClient.get(`/task/getSelectTasks?id=${projectId}`);
  },

  getAllhoursBySlug: (page, pageSize, filter) => {
    const queryParams = new URLSearchParams({
      start: page,
      length: pageSize,
      startDate: filter.startDate,
      endDate: filter.endDate,
      projectId: filter.projectId == 9999999 ? "" : filter.projectId,

    });

    return ApiClient.get(`hours/getAll?${queryParams.toString()}`);
  },


  postHours: (data) => {
    return ApiClient.post("/hours/add", data);
  },

  updateHours: (id, data) => {
    return ApiClient.put(`/hours/update?id=${id}`, data);
  },
  getHoursById: (id) => {
    return ApiClient.get(`/hours/getById?id=${id}`);
  },
  deleteHoursById: (id) => {
    return ApiClient.delete(`/hours/delete?id=${id}`);
  },
  projectFilterData: (startDate, endDate, projectId, isBillable) => {
    return ApiClient.get(
      `/project/getHoursLogByProject?startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&isBillable=${isBillable}`
    );
  },

  getAllGraphRecord: (page, pageSize, filter) => {

    const queryParams = new URLSearchParams({
      start: page,
      length: pageSize,
      startDate: filter.startDate,
      endDate: filter.endDate,
      projectId: filter.projectId.includes("-") ? filter.projectId.split("-").map(Number) : filter.projectId,
      userId: filter.userId.includes("-") ? filter.userId.split("-").map(Number) : filter.userId,
      isBillable: filter.isBillable === 3 ? "" : filter.isBillable
    });

    return ApiClient.get(
      `/hours/getGraphRecords?${queryParams.toString()}`);
  },


};

export default HourLogsService;
