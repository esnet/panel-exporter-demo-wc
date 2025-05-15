const DEFAULT_LIST = [{done: false, hash: "klslj", content: 'Create To-Do Application'}];

export class ToDo extends HTMLElement{

    connectedCallback() {
        if(!localStorage.getItem("todos")){
            localStorage.setItem("todos", JSON.stringify(DEFAULT_LIST))
        }

        try {
            JSON.parse(localStorage.getItem("todos"))
        } catch(err) {
            console.error(err);
            localStorage.setItem("todos", JSON.stringify(DEFAULT_LIST))
        }

        this.todos = JSON.parse(localStorage.getItem("todos"));
        this.inputVal = "";
        this.render();
    }

    randHash(){
        return (Math.random() + 1).toString(36).substring(7)
    }

    renderList(){
        let mainChild = document.createElement("div");
        this.todos.map((todo, idx)=>{
            const toggleDone = (idx)=>{
                return ()=>{
                    todo.done = !todo.done;
                    this.todos[idx] = todo;
                    localStorage.setItem("todos", JSON.stringify(this.todos));
                    this.render();
                }
            }
            const deleteItem = (idx)=>{
                return ()=>{
                    let newTodos = [...this.todos];
                    newTodos.splice(idx, 1);
                    localStorage.setItem("todos", JSON.stringify(newTodos));
                    this.todos = JSON.parse(localStorage.getItem("todos"));
                    this.render();
                }
            }
            let root = document.createElement("div");
            root.setAttribute("class", `item ${todo.done ? 'done' : ''}`);

            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            if(todo.done){
                checkbox.setAttribute("checked", true);
            }
            checkbox.addEventListener("change", toggleDone(idx));
            root.appendChild(checkbox);

            let label = document.createElement("div");
            label.setAttribute("class", "item-label");
            label.addEventListener("click", toggleDone(idx));
            label.innerHTML = todo.content;
            root.appendChild(label);

            if(todo.done){
                let clearItem = document.createElement("div");
                clearItem.setAttribute("class", "clear-item");
                clearItem.addEventListener("click", deleteItem(idx));
                clearItem.innerHTML = "&times;"
                root.appendChild(clearItem);
            }

            mainChild.appendChild(root);
        });
        return mainChild;
    }

    createTodo(ev){
        ev.preventDefault();
        this.todos.push({
            hash: this.randHash(),
            done: false,
            content: this.querySelector("input[type=text]").value
        });
        this.inputVal = "";
        localStorage.setItem("todos", JSON.stringify(this.todos));
        this.render();
    }

    countDone(){
        return this.todos.filter((td)=>{return td.done}).length;
    }

    countTodo(){
        return this.todos.length;
    }

    allDone(){
        return this.countDone() == this.countTodo();
    }

    render(){
        this.innerHTML = `<div class="todo ${ this.allDone() ? "all-done" : "" }">
            <h2>${ this.allDone() ? "✅ " : "" }${this.countDone()}/${this.countTodo()} Done</h2>
            <form>
                <input type='text' value='${this.inputVal}' placeholder='Enter a to-do item...' />
                <input type='submit' value="Create To-Do" />
            </form>
        </div>`
        // set on change
        let textInput = this.querySelector("input[type=text]");
        textInput.addEventListener("change", (ev)=>{ this.inputVal = ev.target.value; })
        // set on click
        let submit = this.querySelector("input[type=submit]");
        submit.addEventListener("click", (ev)=>{ this.createTodo(ev) })
        let children = this.renderList()
        let div = this.querySelector("div.todo");
        div.appendChild(children);
    }
}

customElements.define('to-do', ToDo);