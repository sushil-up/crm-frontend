export const updateNotesCount = (data, action, hoursId) => {
  return data.map((hours) => {
    const newInnerData = {
      ...hours,
      users: hours.users.map((user) => {
        const newUserTask = user.userTask.map((item) => {
          return item.hourId === hoursId
            ? {
                ...item,
                notesCount:
                  action === "add" ? item.notesCount + 1 : item.notesCount - 1,
              }
            : item;
        });

        return {
          ...user,
          userTask: newUserTask,
        };
      }),
    };
    return newInnerData;
  });
};
