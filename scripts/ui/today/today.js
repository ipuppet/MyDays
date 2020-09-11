let HomeUI = require("/scripts/ui/main/home")

class TodayUI {
    constructor(kernel) {
        this.kernel = kernel
    }

    getTopView() {
        let myday = HomeUI.topTemplate()
        if (!myday) $ui.render({
            views: [{
                type: "label",
                props: {
                    text: $l10n("NONE"),
                    align: $align.center
                },
                layout: (make, view) => {
                    make.size.equalTo(view.super)
                }
            }]
        })
        return {
            type: "view",
            props: {
                bgcolor: $color("clear")
            },
            layout: (make, view) => {
                make.width.equalTo(view.super)
                make.height.equalTo(110)
            },
            views: [
                {
                    type: "label",
                    props: myday.dateRaw,
                    layout: make => {
                        make.top.inset(5)
                        make.right.inset(20)
                    }
                },
                {
                    type: "label",
                    props: myday.title,
                    layout: (make, view) => {
                        make.centerY.equalTo(view.super).offset(-15)
                        make.left.inset(20)
                        make.height.equalTo(50)
                    }
                },
                {
                    type: "label",
                    props: myday.dateFlag,
                    layout: (make, view) => {
                        make.centerY.equalTo(view.super).offset(-9)
                        make.left.equalTo(view.prev.right).offset(5)
                        make.height.equalTo(20)
                    }
                },
                {
                    type: "label",
                    props: myday.describe,
                    layout: (make, view) => {
                        make.top.equalTo(view.prev.bottom).offset(10)
                        make.left.equalTo(20)
                    }
                },
                {
                    type: "button",
                    props: Object.assign({ contentEdgeInsets: 5 }, myday.date),
                    layout: (make, view) => {
                        make.centerY.equalTo(view.super)
                        make.right.inset(20)
                    },
                    events: {
                        tapped: () => {
                            $app.openURL(`jsbox://run?name=MyDays&location=today&index=${myday.info.index}`)
                        }
                    }
                }
            ]
        }
    }

    getListView() {
        return {
            type: "list",
            props: {
                data: HomeUI.templateList(this.kernel.storage.all()),
                id: "mydays",
                selectable: false,
                rowHeight: 80,
                template: {
                    views: [
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
                            events: {
                                tapped: sender => {
                                    $app.openURL(`jsbox://run?name=MyDays&location=today&index=${sender.info}`)
                                }
                            },
                            layout: (make, view) => {
                                make.centerY.equalTo(view.super)
                                make.right.inset(20)
                            }
                        }
                    ]
                }
            },
            layout: $layout.fill
        }
    }

    render() {
        let mode = this.kernel.setting.get("general.todayMode")
        let view = mode ? this.getListView() : this.getTopView()
        $ui.render({
            views: [view]
        })
    }
}

module.exports = TodayUI