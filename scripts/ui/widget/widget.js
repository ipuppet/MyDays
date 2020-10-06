let HomeUI = require("/scripts/ui/main/home")

class WidgetUI {
    constructor(kernel) {
        this.kernel = kernel
    }

    localizedWeek(index) {
        let weekday = []
        weekday[0] = $l10n("SUNDAY")
        weekday[1] = $l10n("MONDAY")
        weekday[2] = $l10n("TUESDAY")
        weekday[3] = $l10n("WEDNESDAY")
        weekday[4] = $l10n("THURSDAY")
        weekday[5] = $l10n("FRIDAY")
        weekday[6] = $l10n("SATURDAY")
        return weekday[index]
    }

    getCalendar() {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        let dateNow = date.getDate()// 当前日期
        let dates = new Date(year, month + 1, 0).getDate()// 总天数
        let firstDay = new Date(year, month, 1).getDay()// 本月第一天是周几
        let calendar = []
        for (let date = 1; date <= dates;) {
            let week = []
            for (let day = 0; day <= 6; day++) {
                if (day === firstDay) firstDay = 0
                // 只有当firstDay为0时才开始放入数据，之前的用-1补位
                week.push(firstDay === 0 ? (date > dates ? -1 : date) : -1)
                if (firstDay === 0) date++
            }
            calendar.push(week)
        }
        return {
            calendar: calendar,
            date: dateNow,
        }
    }

    calendarView(ctx) {
        let calendarInfo = this.getCalendar()
        let calendar = calendarInfo.calendar
        let lines = []
        for (let line of calendar) {
            for (let date of line) {
                lines.push({
                    type: "text",
                    props: {
                        text: date === -1 ? "" : date
                    }
                })
            }
        }
        return {
            type: "hgrid",
            props: {
                rows: Array(5).fill({
                    flexible: {
                        minimum: 1,
                        maximum: 10
                    },
                    // spacing: 10,
                    // alignment: $widget.alignment.left
                }),
                /* spacing: 10,
                alignment: $widget.verticalAlignment.center */
            },
            views: lines
        }
    }

    render() {
        $widget.setTimeline({
            entries: [
                {
                    date: new Date(),
                    info: {}
                }
            ],
            policy: {
                //afterDate: aDate
            },
            render: ctx => {
                return this.calendarView(ctx)
            }
        })
    }
}

module.exports = WidgetUI