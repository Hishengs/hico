import './index.less';

setTimeout(() => {
  $('#app').css('color', '#ff6600');
}, 2000);

window.home = {
  sayHi (){
    alert('hi, what\'s up??');
  },
};
