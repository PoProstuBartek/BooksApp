/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      bookList: '.books-list',
      filters: '.filters',
      image: '.book__image',
    }
  };   

  const templates = {
    booklist: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.getElements();
      thisBooksList.render();
      thisBooksList.initActions();
    }
  
    initData() {
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
    }
  
    getElements() {
      const thisBooksList = this;

      thisBooksList.dom = {};
      
      thisBooksList.dom.bookList = document.querySelector(select.containerOf.bookList);
      thisBooksList.dom.filterBooks = document.querySelector(select.containerOf.filters);
    }

    render(){
      const thisBooksList = this;
  
      for(let book of dataSource.books){
        const bookData = {
          id: book.id,
          name: book.name,
          price: book.price,
          rating: book.rating,
          image: book.image,
        };
        const ratingBgc = thisBooksList.determineRatingBgc(bookData.rating);
        bookData.ratingBgc = ratingBgc;
        const ratingWidth = bookData.rating * 10;
        bookData.ratingWidth = ratingWidth;
  
        const generatedHTML = templates.booklist(bookData);
        thisBooksList.element = utils.createDOMFromHTML(generatedHTML);

        thisBooksList.dom.bookList.appendChild(thisBooksList.element);
      }
    }
  
    initActions() {
      const thisBooksList = this;
      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
  
      thisBooksList.dom.bookList.addEventListener('dblclick', function(event){
        event.preventDefault();
        const image = event.target.offsetParent;
        const bookId = image.getAttribute('data-id');
  
        thisBooksList.favoriteBooks.push(bookId);
  
        if(thisBooksList.favoriteBooks.includes(bookId)){
          image.classList.toggle('favorite');
        }   
      });
  
      thisBooksList.dom.filterBooks.addEventListener('click', function(event){
        
        const clickedElem = event.target;
  
        if(clickedElem.tagName === 'INPUT' && clickedElem.type === 'checkbox' && clickedElem.name === 'filter'){
          if(clickedElem.checked){
            thisBooksList.filters.push(clickedElem.value);
          } else {
            const valueIndexof = thisBooksList.filters.indexOf(clickedElem.value);
            thisBooksList.filters.splice(valueIndexof, 1);
          }
          thisBooksList.filter();
        }
      });
    }

    filter(){ 
      const thisBooksList = this;
      for(let book of dataSource.books){
        const filteredBook  = document.querySelector('.book__image[data-id="' + book.id + '"]');
        let shouldBeHidden = false;

        for(let filter of thisBooksList.filters){
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden){
          filteredBook.classList.add('hidden');
        } else {
          filteredBook.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating) {
      let background = '';
      if(rating < 6){
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      } else if(rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      } else if(rating > 8 && rating <= 9){
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      } else if(rating > 9){
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      }
      return background;
    }
  }

  new BooksList();
}