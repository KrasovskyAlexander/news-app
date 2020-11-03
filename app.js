// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function() {
  const keyApi = 'df6a013363494485859f93fee02af89b';
  const urlApi = 'https://newsapi.org/v2';

  return {
    topHeadlines(country ,cb){
      http.get(`${urlApi}/top-headlines?country=${country}&category=technology&apiKey=${keyApi}`,cb);
    },
    everythink(query,cb){
      http.get(`${urlApi}/everything?q=${query}&apiKey=${keyApi}`,cb);
    }
  };
})();
const form = document.forms['newsControls'],
      countrySelect = form.elements['country'],
      src = form.elements['search'];

form.addEventListener('submit', e =>{
  e.preventDefault();
  loadNews();
});
//  init selects
document.addEventListener('DOMContentLoaded', function() {
   M.AutoInit();
   loadNews();
});



function loadNews(){
  showLoader();
  const contry = countrySelect.value,
        search = src.value;
  if(!search){
    newsService.topHeadlines(contry, onGetResponse);
  }else{
    newsService.everythink(search,onGetResponse);
  }
  
}

function onGetResponse(err,res){
  removeLoader();
  if(err){
    showAlert(err,'error-msg');
    return;
  }
  if(!res.articles.length){
    showAlert('По вашему запросу новостей не найдено','rounded');
  }
  renderNews(res.articles);
}

function renderNews(news){
  const newsContainer = document.querySelector('.news-container .row');
  let fragmen = '';
  if(newsContainer.children.length){
    clearContainer(newsContainer);
  }

  news.forEach( newsItem =>{
    const news = newsTemplate(newsItem);
    fragmen += news;
  });
  newsContainer.insertAdjacentHTML('afterbegin',fragmen);
}

function newsTemplate({ urlToImage,title, description, url}){
  return `
  <div class="col s12">
  <div class="card">
    <div class="card-image">
      <img src="${urlToImage}">
      <span class="card-title">${title || ''}</span>
    </div>
    <div class="card-content">
      <p>${description || ''}</p>
    </div>
      <div class="card-action">
        <a href="${url}">Read more</a>
      </div>
    </div>
  </div>
 `;
}
function showAlert(msg,type = 'success'){
  M.toast({html: msg, classes: type});
}
function clearContainer(container){
  let child = container.lastElementChild;
  while(child){
    container.removeChild(child);
    child = container.lastElementChild;
  }
}
function showLoader(){
  document.body.insertAdjacentHTML('beforebegin',
  `
  <div class="progress">
    <div class="indeterminate"></div>
  </div>
  `);
}
function removeLoader(){
  const load = document.querySelector('.progress');
  if(load){
    load.remove();
  }
}