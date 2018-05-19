import moment from 'moment';
import './index.less';

setInterval(() => {
  document.getElementById('now').innerHTML = moment().format('YYYY-MM-DD H:mm:ss');
}, 1000);
