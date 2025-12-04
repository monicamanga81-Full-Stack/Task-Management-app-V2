import localforage from "localforage";

localforage.config({
  name: "task-tracker-pwa",
  storeName: "offline_tasks"
});

export async function saveOfflineTask(task: any) {
  const tasks = (await localforage.getItem("pending_tasks")) || [];
  tasks.push(task);
  await localforage.setItem("pending_tasks", tasks);
}

export async function getOfflineTasks() {
  return (await localforage.getItem("pending_tasks")) || [];
}

export async function clearOfflineTasks() {
  await localforage.setItem("pending_tasks", []);
}
