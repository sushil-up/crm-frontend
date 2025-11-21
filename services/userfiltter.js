import ApiClient from "./apiBase";

const UserFiltter = {
  Allproject: () => {
    return ApiClient.get(`project/getAll?start=""&length=""`);
  },
  getAllTask: () => {
    return ApiClient.get(`task/getAll?start=""&length=""`);
  },

  getdailyData: () => {
    return ApiClient.get(`hours/getAll?start=""&length=""`);
  },

  getHoursLogGroupByUsers: (filter) => {

    const queryParams = new URLSearchParams({

      startDate: filter.startDate,
      endDate: filter.endDate,
      userId: filter.userId,
      isBillable: filter.isBillable == 3 ? "" : filter.isBillable

    });
    return ApiClient.get(`user/getHoursLogGroupByUsers?${queryParams.toString()}`);

  },
  togetFilterData: (startDate, endDate, userId, isBillable) => {
    return ApiClient.get(
      `user/getHoursLogGroupByUsers?startDate=${startDate}&endDate=${endDate}&userId=${userId}&isBillable=${isBillable}`
    );
  },
};

export default UserFiltter;
