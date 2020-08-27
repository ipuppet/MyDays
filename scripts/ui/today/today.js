let HomeUI = require("/scripts/ui/main/home")

class TodayUI {
    constructor(kernel) {
        this.kernel = kernel
    }

    get_top_view() {
        let myday = HomeUI.template_top()
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
                    props: myday.title,
                    layout: (make) => {
                        make.top.inset(0)
                        make.left.inset(20)
                        make.height.equalTo(50)
                    }
                },
                {
                    type: "label",
                    props: myday.describe,
                    layout: (make, view) => {
                        make.bottom.inset(20)
                        make.left.equalTo(view.prev)
                        make.height.equalTo(20)
                    }
                },
                {
                    type: "button",
                    props: Object.assign({
                        font: $font(14),
                        contentEdgeInsets: 5
                    }, myday.date),
                    layout: make => {
                        make.top.inset(25)
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

    get_list_view() {
        return {
            type: "list",
            props: {
                data: HomeUI.template_list(this.kernel.storage.all()),
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
        let mode = this.kernel.setting.get("setting.general.today_mode")
        let view = mode ? this.get_list_view() : this.get_top_view()
        $ui.render({
            views: [view]
        })
    }
}

module.exports = TodayUI