import {action, computed, makeObservable, observable} from "mobx";
import React from "react";

class Item {
    _done = false;
    _title = "";
    _id = Math.random() * 10 ** 5 | 0;

    constructor(title) {
        this._title = title;

        makeObservable(this, {
            _done: observable,
            toggle: action
        });
    }

    get id() {
        return this._id;
    }

    get done() {
        return this._done;
    }

    get title() {
        return this._title;
    }

    toggle() {
        this._done = !this._done;
    }
}

class Store {
    _items = [];
    _tab = "all";

    constructor() {
        makeObservable(this, {
            _items: observable,
            items: computed,
            remains: computed,
            _tab: observable,
            addItem: action,
            selectTab: action,
            clearCompleted: action
        });
    }

    get items() {
        switch (this._tab) {
            case "all":
                return this._items;
            case "active":
                return this._items.filter(item => !item.done);
            case "completed":
                return this._items.filter(item => item.done);
            default:
                return [];
        }
    }

    get remains() {
        return this._items.reduce((acc, item) => acc + (item.done ? 0 : 1), 0);
    }

    get tab() {
        return this._tab;
    }

    addItem(title) {
        this._items.push(new Item(title));
    }

    selectTab(tab) {
        this._tab = tab;
    }

    clearCompleted() {
        this._items = this._items.filter(item => !item.done);
    }
}

const StoreContext = React.createContext(null);

export {Store, StoreContext};
