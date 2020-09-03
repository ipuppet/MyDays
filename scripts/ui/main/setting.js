const BaseUISetting = require("/scripts/ui/components/base-ui-setting")

class SettingUI extends BaseUISetting {
    constructor(kernel, factory) {
        super(kernel, factory)
    }

    readme() {
        const content = $file.read("/README.md").string
        this.factory.push([{
            type: "markdown",
            props: { content: content },
            layout: (make, view) => {
                make.size.equalTo(view.super)
            }
        }])
    }

    backup_to_iCloud() {
        this.start()
        const backup_action = () => {
            if (this.kernel.storage.backup_to_iCloud()) {
                $ui.alert($l10n("BACKUP_SUCCESS"))
            } else {
                $ui.alert($l10n("BACKUP_ERROR"))
            }
        }
        if (this.kernel.storage.has_backup()) {
            $ui.alert({
                title: $l10n("BACKUP"),
                message: $l10n("ALREADY_HAS_BACKUP"),
                actions: [
                    {
                        title: $l10n("OK"),
                        handler: () => {
                            backup_action()
                            this.done()
                        }
                    },
                    { title: $l10n("CANCEL") }
                ]
            })
        } else {
            backup_action()
        }
    }

    recover_from_iCloud() {
        this.start()
        $drive.open({
            handler: data => {
                if (this.kernel.storage.recover_from_iCloud(data)) {
                    // 更新列表
                    let home = require("./home")
                    home.update(this.kernel.storage.all())
                    // 完成动画
                    this.done()
                }
            }
        })
    }
}

module.exports = SettingUI