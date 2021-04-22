const { dialog, Notification } = require('electron');
const { differenceInSeconds, form } = require('date-fns')

class Timer {

  constructor(updateView, icon) {
    this.updateView = updateView;
    this.icon = icon;

    this.started = false;
    this.intervalId = null;
    this.endTime = 0;
    this.seconds = this.endTime;
  }

  toggle() {
    if(this.endTime === 0) return 'new';
    if (!this.started) {
      this.continue()
      return "start"
    };
    this.pause();
    return "pause"
  }

  start(minutes) {
    if (!minutes) return;
    if (this.started) this.pause();

    this.endTime = minutes * 60;
    this.started = true;
    this.seconds = this.endTime;
    this.updateView();
    
    this.run();
  }

  run() {
    this.intervalId = setInterval(() => {
      if (this.seconds <= 0) {
        this.pause();
        this.endTime = 0;
        dialog.showMessageBox({ message: "Seu tempo acabou!", icon: this.icon, buttons: ['Ok'] });
      }
      this.seconds--;
      this.updateView();

    }, 1000);
  }

  continue() {
    this.started = true;
    this.updateView();
    this.run();
  }

  pause() {
    this.started = false;
    clearInterval(this.intervalId);
    this.updateView();
  }

  remainingTime() {
    if(!this.started){
      return dialog.showMessageBox({
        message: `O timer ainda não foi iniciado!`,
        icon: this.icon,
        buttons: ['Ok']
      })
    }
    return new Notification({
      title: 'Tempo restante!',
      body: `Falta ${Math.trunc(this.seconds / 60)} minutos e ${this.seconds % 60} segundos`,
      icon: this.icon,
    }).show()
  }

}


module.exports = Timer;