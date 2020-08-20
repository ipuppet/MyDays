class ColorUI {
    constructor(kernel, factory) {
        this.kernel = kernel
        this.factory = factory
        this.width = $device.info.screen.width
        $cache.set("rgb_r", 255)
        $cache.set("rgb_g", 255)
        $cache.set("rgb_b", 255)
    }

    rgb_template(id) {
        return {
            type: "view",
            layout: (make, view) => {
                make.top.equalTo(view.prev.bottom).offset(25)
                make.width.equalTo(view.super)
                make.height.equalTo(50)
            },
            views: [
                {
                    type: "label",
                    props: {
                        font: $font(13),
                        text: id
                    },
                    layout: make => {
                        make.top.equalTo(0)
                        make.left.inset(50)
                    }
                },
                {
                    type: "view",
                    layout: (make, view) => {
                        make.top.equalTo(view.prev.bottom).offset(10)
                        make.width.equalTo(view.super)
                        make.height.equalTo(20)
                    },
                    views: [
                        {
                            type: "label",
                            props: {
                                id: `${id}_value`,
                                font: $font(13),
                                text: $cache.get(id),
                                align: $align.right
                            },
                            layout: (make, view) => {
                                make.centerY.equalTo(view.super)
                                make.left.inset(10)
                                make.width.equalTo(30)
                            }
                        },
                        {
                            type: "gradient",
                            props: {
                                id: `${id}_grad`,
                                radius: 2,
                                borderWidth: 0.2,
                                borderColor: $color("systemGray2"),
                                locations: [0.0, 1.0],
                                startPoint: $point(0, 1),
                                endPoint: $point(1, 1)
                            },
                            layout: (make, view) => {
                                make.centerY.equalTo(view.super)
                                make.size.equalTo($size(this.width - 70, 4))
                                make.left.inset(50)
                            }
                        },
                        {
                            type: "slider",
                            props: {
                                id: `${id}_slider`,
                                value: $cache.get(id) / 255,
                                minColor: $color("clear"),
                                maxColor: $color("clear")
                            },
                            layout: (make, view) => {
                                make.centerY.equalTo(view.super)
                                make.left.width.equalTo(view.prev)
                            },
                            events: {
                                changed: sender => {
                                    $(`${id}_value`).text = Math.ceil(sender.value * 255)
                                }
                            }
                        }
                    ]
                }
            ]
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

                    }
                }
            }
        ]
        let views = [
            {
                type: "view",
                views: [
                    {
                        type: "view",
                        layout: (make) => {
                            make.size.equalTo($size(10, 10))
                        }
                    },
                    this.rgb_template("rgb_r"),
                    this.rgb_template("rgb_g"),
                    this.rgb_template("rgb_b")
                ]
            }
        ]
        this.factory.push(views, $l10n("BACK"), nav_buttons)
    }
}

module.exports = ColorUI