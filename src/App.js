import React, {useCallback, useContext, useMemo, useState} from "react";
import {observer} from "mobx-react";
import {Store, StoreContext} from "./store";

const TABS = ["all", "active", "completed"];
const Tabs = observer(() => {
    const store = useContext(StoreContext);
    const handleChange = useCallback(
        e => {
            const {value} = e.target;

            store.selectTab(value);
        },
        [store]
    );
    const {tab} = store;

    return (
        <>
            {TABS.map(value => (
                <React.Fragment key={value}>
                    <input type="radio"
                        onChange={handleChange}
                        id={`tab-${value}`}
                        checked={tab === value}
                        value={value} />
                    <label htmlFor={`tab-${value}`}>{value}</label>
                </React.Fragment>
            ))}
        </>
    );
});
const Bottom = observer(() => {
    const store = useContext(StoreContext);
    const {remains} = store;
    const handleClear = useCallback(
        () => {
            store.clearCompleted();
        },
        [store]
    );

    return (
        <div>
            <span>{remains} items left</span>
            <Tabs />
            <button onClick={handleClear}>Clear Completed</button>
        </div>
    );
});
const Item = observer(({item}) => {
    const {id, title, done} = item;
    const handleChange = useCallback(
        () => {
            item.toggle();
        },
        [item]
    );

    return (
        <li>
            <input type="checkbox"
                checked={done}
                id={id}
                name={title}
                onChange={handleChange}/>
            <label htmlFor={id}>{title}</label>
        </li>
    );

});
const Items = observer(() => {
    const store = useContext(StoreContext);
    const {items} = store;

    return (
        <ul>
            {items.map(item => <Item key={item.id} item={item} />)}
        </ul>
    );
});
const Input = observer(() => {
    const store = useContext(StoreContext);
    const [value, setValue] = useState("");
    const handleChange = useCallback(
        e => {
            const {value} = e.target;

            setValue(value);
        },
        []
    );
    const handleKeyDown = useCallback(
        e => {
            const {keyCode} = e;

            if (keyCode !== 13) {
                // if not enter
                return;
            }

            store.addItem(value);
            setValue("");
        },
        [store, value]
    );

    return (
        <input type="text"
            placeholder="What needs to be done?"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown} />
    );
});

const Todo = observer(() => {
    const store = useMemo(() => new Store(), []);

    return (
        <div>
            <StoreContext.Provider value={store}>
                <Input />
                <Items />
                <Bottom />
            </StoreContext.Provider>
        </div>
    );
});

export default Todo;
