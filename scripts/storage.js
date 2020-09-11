class Storage {
    constructor(setting) {
        this.setting = setting
        this.localDb = "/assets/MyDays.db"
        this.iCloudPath = "drive://MyDays/"
        this.iCloudDb = this.iCloudPath + "MyDays.db"
        this.iCloudAutoDb = this.iCloudPath + "auto.db"
        this.sqlite = $sqlite.open(this.localDb)
        this.sqlite.update("CREATE TABLE IF NOT EXISTS mydays(id INTEGER PRIMARY KEY NOT NULL, title TEXT, `describe` TEXT, date INTEGER, style TEXT, type TEXT)")
    }

    parse(result) {
        if (result.error !== null) {
            $console.error(result.error)
            return false
        }
        let data = []
        while (result.result.next()) {
            data.push({
                id: result.result.get("id"),
                title: result.result.get("title"),
                describe: result.result.get("describe"),
                date: result.result.get("date"),
                style: JSON.parse(result.result.get("style")),
                type: JSON.parse(result.result.get("type"))
            })
        }
        // result.result.close()
        return data
    }

    all() {
        let result = this.sqlite.query("SELECT * FROM mydays ORDER BY date ASC")
        return this.parse(result)
    }

    search(kw) {
        let result = this.sqlite.query({
            sql: "SELECT * FROM mydays WHERE title like ?",
            args: [`%${kw}%`]
        })
        return this.parse(result)
    }

    save(myday) {
        let result
        myday.style = myday.style ? myday.style : []
        result = this.sqlite.update({
            sql: "INSERT INTO mydays (title, `describe`, date, style, type) values(?, ?, ?, ?, ?)",
            args: [myday.title, myday.describe, myday.date, JSON.stringify(myday.style), JSON.stringify(myday.type)]
        })
        if (result.result) {
            if (this.setting.get("backup.autoBackup")) {
                if (!$file.exists(this.iCloudPath)) {
                    $file.mkdir(this.iCloudPath)
                }
                $file.write({
                    data: $data({ path: this.localDb }),
                    path: this.iCloudAutoDb
                })
            }
            return true
        }
        $console.error(result.error)
        return false
    }

    hasBackup() {
        return $file.exists(this.iCloudDb)
    }

    backupToICloud() {
        if (!$file.exists(this.iCloudPath)) {
            $file.mkdir(this.iCloudPath)
        }
        return $file.write({
            data: $data({ path: this.localDb }),
            path: this.iCloudDb
        })
    }

    recoverFromICloud(data) {
        let result = $file.write({
            data: data,
            path: this.localDb
        })
        if (result) {
            this.sqlite = $sqlite.open(this.localDb)
        }
        return result
    }

    update(myday) {
        let result
        result = this.sqlite.update({
            sql: "UPDATE mydays SET title = ?, `describe` = ?, date = ?, style = ?, type = ? WHERE id = ?",
            args: [myday.title, myday.describe, myday.date, JSON.stringify(myday.style), JSON.stringify(myday.type), myday.id]
        })
        if (result.result) {
            return true
        }
        $console.error(result.error)
        return false
    }

    delete(id) {
        let result = this.sqlite.update({
            sql: "DELETE FROM mydays WHERE id = ?",
            args: [id]
        })
        if (result.result) {
            return true
        }
        $console.error(result.error)
        return false
    }
}

module.exports = Storage