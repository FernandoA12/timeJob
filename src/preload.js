
window.onload = () => {
  const script = document.createElement('script');
  let classList;
  script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
  document.head.appendChild(script)
  setInterval(() => {
    const containerButton = document.getElementsByClassName('upload').item(0);
    if(containerButton){
      if(!classList){
        classList = containerButton.children.item(0).classList;
      }
      containerButton.removeChild(containerButton.children.item(0));
      createNewButtonUploader(containerButton, classList)
    }
  }, 1000)
}
function createNewButtonUploader(container, classList) {
  if(container.children.length > 1) return;
  const buttonUpload = document.createElement('button');
  buttonUpload.id = 'newbuttonupload'
  buttonUpload.innerHTML = 'Tirar Foto';
  buttonUpload.classList = classList;
  container.appendChild(buttonUpload)
}

