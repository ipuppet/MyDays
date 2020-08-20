let HomeUI = require("/scripts/ui/main/home")

class TodayUI {
    constructor(kernel) {
        this.kernel = kernel
        if (!$cache.get("myday_top")) {
            $cache.set("myday_top", HomeUI.template(this.kernel.storage.all()[0]))
        }
    }

    get_top_view() {
        let myday = $cache.get("myday_top")
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
                    type: "label",
                    props: myday.date,
                    layout: make => {
                        make.top.inset(25)
                        make.right.inset(20)
                    }
                }
            ]
        }
    }

    get_list_view() {
        return {
            type: "list",
            props: {
                data: HomeUI.to_template(this.kernel.storage.all()),
                id: "mydays",
                //separatorHidden: true,
                selectable: false,
                rowHeight: 80,
                template: {
                    props: {},
                    views: [
                        {
                            type: "label",
                            props: { id: "info" },
                            layout: (make) => {
                                make.top.inset(10)
                                make.left.inset(20)
                            }
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
                            type: "label",
                            props: { id: "date" },
                            layout: (make, view) => {
                                make.bottom.inset(10)
                                make.centerY.equalTo(view.super)
                                make.right.inset(10)
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