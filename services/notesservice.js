import ApiClient from "./apiBase";
const NotesService = {
  addNotes: (data) => {
    return ApiClient.post("/notes/add", data);
  },
  getAllNotes: (id) => {
    return ApiClient.get(`notes/getAll?hourLogId=${id}`);
  },

  getNotesById: (id) => {
    return ApiClient.get(`notes/noteById?id=${id}`);
  },

  updateNotes: (id, data) => {
    return ApiClient.put(`notes/update?id=${id}`, data);
  },

  deleteNotes: (id) => {
    return ApiClient.delete(`notes/delete?id=${id}`);
  },
};
export default NotesService;
