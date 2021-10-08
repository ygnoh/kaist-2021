import React from "react";
import {observer} from "mobx-react";
import {Store, StoreContext} from "./store";

const TABS = ["all", "active", "completed"];
const Tabs = observer(class Tabs extends React.Component {
    static contextType = StoreContext;

    render() {
        const {tab} = this.context;

        return (
            <>
                {TABS.map(value => (
                    <React.Fragment key={value}>
                        <input type="radio"
                            onChange={this._handleChange}
                            id={`tab-${value}`}
                            checked={tab === value}
                            value={value} />
                        <label htmlFor={`tab-${value}`}>{value}</label>
                    </React.Fragment>
                ))}
            </>
        );
    }

    _handleChange = e => {
        const {value} = e.target;

        this.context.selectTab(value);
    };
});
const Bottom = observer(class Bottom extends React.Component {
    static contextType = StoreContext;

    render() {
        const {remains} = this.context;

        return (
            <div>
                <span>{remains} items left</span>
                <Tabs />
                <button onClick={this._handleClear}>Clear Completed</button>
            </div>
        );
    }

    _handleClear = () => {
        this.context.clearCompleted();
    };
});
const Item = observer(class Item extends React.Component {
    render() {
        const {id, title, done} = this.props.item;

        return (
            <li>
                <input type="checkbox"
                    checked={done}
                    id={id}
                    name={title}
                    onChange={this._handleChange}/>
                <label htmlFor={id}>{title}</label>
            </li>
        );
    }

    _handleChange = () => {
        this.props.item.toggle();
    };
});
const Items = observer(class Items extends React.Component {
    static contextType = StoreContext;

    render() {
        const {items} = this.context;
        return (
            <ul>
                {items.map(item => <Item key={item.id} item={item} />)}
            </ul>
        );
    }
});
const Input = observer(class Input extends React.Component {
    static contextType = StoreContext;

    state = {
        value: ""
    };

    render() {
        const {value} = this.state;

        return (
            <input type="text"
                placeholder="What needs to be done?"
                value={value}
                onChange={this._handleChange}
                onKeyDown={this._handleKeyDown} />
        );
    }

    _handleChange = e => {
        const {value} = e.target;

        this.setState({value});
    };

    _handleKeyDown = e => {
        const {keyCode} = e;

        if (keyCode !== 13) {
            // if not enter
            return;
        }

        this.context.addItem(this.state.value);
        this.setState({value: ""});
    };
});

const store = new Store();

class Todo extends React.Component {
    render() {
        return (
            <StoreContext.Provider value={store}>
                <Input />
                <Items />
                <Bottom />
            </StoreContext.Provider>
        );
    }
}

export default observer(Todo);
