const ColorUI = require("./color")

class EditorUI {
    constructor(kernel, factory) {
        this.kernel = kernel
        this.factory = factory
        this.color = new ColorUI(this.kernel, this.factory)
    }

    save(myday, is_update, callback) {
        if (myday.myday === "") {
            $ui.toast($l10n("NO_myday"))
            return false
        }
        let result = false
        if (is_update) {
            result = this.kernel.storage.update(myday)
        } else {
            result = this.kernel.storage.save(myday)
        }
        if (result) {
            $ui.success($l10n("SAVE_SUCCESS"))
            // 更新list
            callback()
            // 弹出窗口
            setTimeout(() => {
                $ui.pop()
            }, 500)
        } else {
            $ui.error($l10n("SAVE_ERROR"))
        }
    }

    push(myday = null, callback = null) {
        if (myday === null) {
            myday = {
                title: "",
                describe: "",
                date: "",
                style: []
            }
        }
        let nav_buttons = [
            {
                type: "button",
                props: {
                    symbol: "checkmark",
                    tintColor: this.factory.text_color,
                    bgcolor: $color("clear")
                },
                layout: make => {
                    make.right.inset(10)
                    make.size.equalTo(20)
                },
                events: {
                    tapped: () => {
                        myday.title = $("title").text.trim()
                        myday.describe = $("describe").text.trim()
                        myday.date = $("date").text.trim()
                        if (myday.date === "") {
                            myday.date = new Date().toLocaleDateString()
                        }
                        myday.style = {// 暂时不支持自定义
                            title: {
                                color: ["primaryText", "secondaryText"],
                                font: ["default", 30]
                            },
                            describe: {
                                color: ["primaryText", "secondaryText"],
                                font: ["default", 14]
                            },
                            date: {
                                color: ["red", "green"],
                                font: ["default", 25]
                            }
                        }
                        let is_update = false
                        if (undefined !== myday.id) {
                            is_update = true
                        }
                        this.save(myday, is_update, callback)
                    }
                }
            }
        ]
        let views = [
            {
                type: "label",
                props: {
                    text: $l10n("TITLE"),
                    textColor: this.factory.text_color,
                    align: $align.left,
                    font: $font(16),
                    line: 1,
                },
                layout: make => {
                    make.left.inset(10)
                    make.width.equalTo(60)
                    make.height.equalTo(40)
                    make.top.equalTo(40)
                }
            },
            {
                type: "input",
                props: {
                    id: "title",
                    align: $align.left,
                    insets: 0,
                    text: myday.title,
                    placeholder: $l10n("TITLE"),
                    textColor: this.factory.text_color,
                },
                layout: (make, view) => {
                    make.right.inset(10)
                    make.left.inset(60)
                    make.height.top.equalTo(view.prev)
                },
                events: {
                    returned: sender => {
                        sender.blur()
                    }
                }
            },
            {
                type: "label",
                props: {
                    text: $l10n("DESCRIBE"),
                    textColor: this.factory.text_color,
                    align: $align.left,
                    font: $font(16),
                    line: 1,
                },
                layout: (make, view) => {
                    make.left.inset(10)
                    make.width.equalTo(60)
                    make.height.equalTo(view.prev)
                    make.top.equalTo(view.prev.bottom).offset(20)
                }
            },
            {
                type: "input",
                props: {
                    id: "describe",
                    align: $align.left,
                    text: myday.describe,
                    placeholder: $l10n("DESCRIBE"),
                    textColor: this.factory.text_color,
                },
                layout: (make, view) => {
                    make.right.inset(10)
                    make.left.inset(60)
                    make.height.equalTo(view.prev)
                    make.top.equalTo(view.prev)
                },
                events: {
                    returned: sender => {
                        sender.blur()
                    }
                }
            },
            /* {
                type: "view",
                props: { bgcolor: $color("blue") },
                views: [
                    {
                        type: "label",
                        props: {
                            text: $l10n("TITLE_COLOR"),
                            //textColor:$color()
                        },
                        events: {
                            tapped: sender => {
                                this.color.push()
                            }
                        },
                        layout: (make, view) => {
                            make.left.inset(10)
                            make.top.equalTo(view.prev)
                        }
                    },
                    {
                        type: "label",
                        props: {
                            text: $l10n("TITLE_COLOR"),
                            //textColor:$color()
                        },
                        layout: (make, view) => {
                            make.left.inset(10)
                            make.top.equalTo(view.prev)
                        }
                    }
                ],
                layout: (make, view) => {
                    make.right.left.inset(0)
                    make.top.equalTo(view.prev.bottom).offset(20)
                    make.height.equalTo(50)
                }
            }, */
            {
                type: "view",
                views: [
                    {
                        type: "label",
                        props: {
                            text: $l10n("DATE"),
                            textColor: this.factory.text_color,
                            align: $align.left,
                            font: $font(16),
                            line: 1,
                        },
                        layout: make => {
                            make.left.inset(10)
                            make.width.equalTo(60)
                            make.height.equalTo(40)
                            make.top.equalTo(0)
                        }
                    },
                    {
                        type: "text",
                        props: {
                            id: "date",
                            editable: false,
                            align: $align.right,
                            bgcolor: $color("clear"),
                            text: myday.date ? new Date(myday.date).toLocaleDateString() : "",
                            textColor: this.factory.text_color,
                            placeholder: $l10n("CHOOSE_DATE")
                        },
                        layout: (make, view) => {
                            make.right.inset(10)
                            make.left.inset(60)
                            make.top.height.equalTo(view.prev)
                        }
                    },
                    {
                        type: "date-picker",
                        props: {
                            date: myday.date ? new Date(myday.date) : new Date(),
                            mode: 1
                        },
                        events: {
                            changed: sender => {
                                $("date").text = sender.date.toLocaleDateString()
                            }
                        },
                        layout: (make, view) => {
                            make.right.left.inset(0)
                            make.top.equalTo(view.prev.bottom)
                            make.height.equalTo(180)
                        }
                    }
                ],
                layout: (make, view) => {
                    make.right.left.inset(0)
                    make.top.equalTo(view.prev.bottom).offset(20)
                    make.height.equalTo(220)
                }
            }
        ]
        this.factory.push(views, $l10n("BACK"), nav_buttons)
    }
}

module.exports = EditorUI