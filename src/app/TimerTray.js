const { Tray } = require('electron')
module.exports = class TimerTray extends Tray {
  onClick(event, bounds){
    console.log('teste')
  }
  constructor(iconPath){
    super(iconPath)
    console.log(this.onClick)
    // this.on('click', this.onClick.bind(this))
  }

  
}