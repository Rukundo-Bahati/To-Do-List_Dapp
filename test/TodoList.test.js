const TodoList = artifacts.require("TodoList");

contract("TodoList", accounts => {
  it("should create a task", async () => {
    const instance = await TodoList.deployed();
    await instance.createTask("Test task", { from: accounts[0] });
    const taskCount = await instance.taskCount();
    const task = await instance.getTask(taskCount); // Check the latest task
    assert.equal(task[1], "Test task", "Task content should match");
    assert.equal(task[2], false, "Task should not be completed");
  });

  it("should increment taskCount", async () => {
    const instance = await TodoList.deployed();
    const initialCount = await instance.taskCount();
    await instance.createTask("Another task", { from: accounts[0] });
    const newCount = await instance.taskCount();
    assert.equal(newCount.toNumber(), initialCount.toNumber() + 1, "Task count should increment");
  });
});