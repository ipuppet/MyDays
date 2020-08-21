const EditorUI = require("./editor")

class HomeUI {
    constructor(kernel, factory) {
        this.kernel = kernel
        this.factory = factory
        this.editor = new EditorUI(this.kernel, this.factory)
    }

    static update(data) {
        $("mydays").data = HomeUI.template_list(data)
    }

    static update_top(data) {
        $cache.set("myday_top", data)
        let template = HomeUI.template(data)
        $("myday_top_title").props = template.title
        $("myday_top_describe").props = template.describe
        $("myday_top_date").props = template.date
    }

    static date_span(date) {
        let span = Math.floor((new Date(date).getTime()) - (new Date().getTime()))
        if (Math.abs(span) < 1000 * 60 * 60 * 24) {
            return {
                color: 0,
                text: $l10n("LESS_THAN_A_DAY")
            }
        }
        let unit = $l10n("DAY")// 默认大于1天按天显示
        let result = span / 1000 / 60 / 60 / 24 // 天数
        if (result < 1 && result > 0) {// 小于1天且大于0则按小时显示
            result = span / 1000 / 60 / 60 - (24 * span)
            unit = $l10n("HOUR")
        }
        result = parseInt(result)
        let flag = result > 0 ? $l10n("DAYS_LEFT") : $l10n("DAYS_PASS")
        return {
            color: result > 0 ? 1 : 0,
            text: `${flag} ${Math.abs(result)} ${unit}`
        }
    }

    /**
     * 将数据转换为模板需要的格式
     * @param {*} data 
     */
    static template(data) {
        if (!data) return
        let date = HomeUI.date_span(data.date)
        return {
            info: data,
            title: {
                text: data.title,
                textColor: $color(data.style.title.color[0], data.style.title.color[1]),
                font: $font(data.style.title.font[0], data.style.title.font[1])
            },
            describe: {
                text: data.describe,
                textColor: $color(data.style.describe.color[0], data.style.describe.color[1]),
                font: $font(data.style.describe.font[0], data.style.describe.font[1])
            },
            date: {
                title: date.text,
                bgcolor: $color(data.style.date.color[date.color])
            }
        }
    }

    static template_list(data) {
        let result = []
        for (let myday of data) {
            result.push(HomeUI.template(myday))
        }
        return result
    }

    static template_top() {
        let data = {}
        if ($cache.get("myday_top")) {
            try {
                data = HomeUI.template($cache.get("myday_top"))
            } catch (error) {
                setTimeout(() => { $ui.toast($l10n("RESER_TOP")) }, 1000)
            }
        }
        return data
    }

    get_views() {
        let myday_top = HomeUI.template_top()
        return [
            {
                type: "view",
                layout: (make, view) => {
                    make.top.equalTo(view.super.safeAreaTop)
                    make.width.equalTo(view.super)
                    make.height.equalTo(50)
                },
                views: [
                    {
                        type: "label",
                        props: {
                            text: $l10n("MY_DAYS")
                        },
                        layout: (make, view) => {
                            make.left.inset(20)
                            make.height.equalTo(view.super)
                        }
                    },
                    {
                        type: "button",
                        props: {
                            symbol: "plus",
                            tintColor: this.factory.text_color,
                            bgcolor: $color("clear")
                        },
                        layout: make => {
                            make.right.inset(0)
                            make.size.equalTo(50)
                        },
                        events: {
                            tapped: () => {
                                this.editor.push(null, () => { HomeUI.update(this.kernel.storage.all()) })
                            }
                        }
                    }
                ]
            },
            {
                type: "label",
                props: {
                    text: $l10n("MYDAYS_TOP"),
                    font: $font(14),
                    textColor: $color("secondaryText")
                },
                layout: (make, view) => {
                    make.top.equalTo(view.prev.bottom).offset(10)
                    make.left.inset(20)
                }
            },
            {
                type: "view",
                props: {
                    bgcolor: $color("clear"),
                    cornerRadius: 10,
                    smoothCorners: true,
                    borderWidth: 0.2,
                    borderColor: $color("primaryText")
                },
                layout: (make, view) => {
                    make.top.equalTo(view.prev.bottom).offset(10)
                    make.left.right.inset(10)
                    make.height.equalTo(110)
                },
                views: [
                    {
                        type: "label",
                        props: Object.assign({ id: "myday_top_title" }, myday_top.title),
                        layout: (make) => {
                            make.top.inset(0)
                            make.left.inset(20)
                            make.height.equalTo(50)
                        }
                    },
                    {
                        type: "label",
                        props: Object.assign({ id: "myday_top_describe" }, myday_top.describe),
                        layout: (make, view) => {
                            make.bottom.inset(20)
                            make.left.equalTo(view.prev)
                            make.height.equalTo(20)
                        }
                    },
                    {
                        type: "button",
                        props: Object.assign({
                            id: "myday_top_date",
                            font: $font(14),
                            contentEdgeInsets: 5
                        }, myday_top.date),
                        layout: make => {
                            make.top.inset(25)
                            make.right.inset(20)
                        }
                    }
                ]
            },
            {
                type: "list",
                props: {
                    data: HomeUI.template_list(this.kernel.storage.all()),
                    id: "mydays",
                    indicatorInsets: $insets(0, 0, 50, 0),
                    header: {
                        type: "view",
                        props: {
                            height: 30
                        },
                        views: [
                            {
                                type: "label",
                                props: {
                                    text: $l10n("MYDAYS_LIST"),
                                    font: $font(14),
                                    textColor: $color("secondaryText")
                                },
                                layout: make => {
                                    make.left.inset(20)
                                }
                            }
                        ]
                    },
                    footer: {
                        type: "view",
                        props: {
                            height: 60
                        },
                        views: [
                            {
                                type: "label",
                                props: {
                                    font: $font(14),
                                    text: $l10n("LIST_END"),
                                    textColor: $color({
                                        light: "#C0C0C0",
                                        dark: "#545454"
                                    }),
                                    align: $align.center
                                },
                                layout: (make, view) => {
                                    make.bottom.inset(5)
                                    make.left.right.inset(0)
                                }
                            }
                        ]
                    },
                    rowHeight: 80,
                    template: {
                        views: [
                            {
                                type: "label",
                                props: { id: "info", hidden: true }
                            },
                            {
                                type: "label",
                                props: { id: "title" },
                                layout: (make) => {
                                    make.top.inset(10)
                                    make.left.inset(20)
                                }
                            },
                            {
                                type: "label",
                                props: { id: "describe" },
                                layout: (make, view) => {
                                    make.bottom.inset(10)
                                    make.left.equalTo(view.prev)
                                }
                            },
                            {
                                type: "button",
                                props: {
                                    id: "date",
                                    font: $font(14),
                                    contentEdgeInsets: 5
                                },
                                layout: (make, view) => {
                                    make.centerY.equalTo(view.super)
                                    make.right.inset(20)
                                }
                            }
                        ]
                    },
                    actions: [
                        {
                            title: $l10n("DELETE"),
                            color: $color("red"),
                            handler: (sender, indexPath) => {
                                let data = sender.object(indexPath).info
                                let date = sender.object(indexPath).date.text
                                let delete_action = () => {
                                    if (this.kernel.storage.delete(data.id))
                                        sender.delete(indexPath)
                                }
                                if (this.kernel.setting.get("setting.general.delete_confirm")) {
                                    $ui.alert({
                                        title: $l10n("CONFIRM_DELETE_MSG"),
                                        message: `${data.title} \n ${data.date} ${date}`,
                                        actions: [
                                            {
                                                title: $l10n("OK"),
                                                handler: delete_action
                                            },
                                            { title: $l10n("CANCEL") }
                                        ]
                                    })
                                } else {
                                    delete_action()
                                }
                            }
                        },
                        {
                            title: $l10n("MYDAYS_TOP"),
                            color: $color("orange"),
                            handler: (sender, indexPath) => {
                                let data = sender.object(indexPath).info
                                HomeUI.update_top(data)
                            }
                        }
                    ]
                },
                events: {
                    didSelect: (sender, indexPath, data) => {
                        this.editor.push(data.info, () => {
                            HomeUI.update(this.kernel.storage.all())
                            if (data.info.id === $cache.get("myday_top").id) {
                                HomeUI.update_top(data.info)
                            }
                        })
                    }
                },
                layout: (make, view) => {
                    make.left.right.inset(0)
                    make.top.equalTo(view.prev.bottom).offset(10)
                    make.bottom.inset(0)
                }
            }
        ]
    }
}

module.exports = HomeUI