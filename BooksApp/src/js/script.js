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

  const favoriteBooks = [];
  const filters = [];

  const render = function(){
    const thisBookList = this;

    for(let book of dataSource.books){
      const bookData = {
        id: book.id,
        name: book.name,
        price: book.price,
        rating: book.rating,
        image: book.image,
      };
      const ratingBgc = determineRatingBgc(bookData.rating);
      bookData.ratingBgc = ratingBgc;
      const ratingWidth = bookData.rating * 10;
      bookData.ratingWidth = ratingWidth;

      const generatedHTML = templates.booklist(bookData);
      thisBookList.element = utils.createDOMFromHTML(generatedHTML);
      
      const listContainer = document.querySelector(select.containerOf.bookList);
      listContainer.appendChild(thisBookList.element);
    }
  };

  
  const initActions = function(){
    const thisBookList = this;
    // const booksList = document.querySelector(select.containerOf.bookList);
    // const bookImages = booksList.querySelectorAll(select.containerOf.image);
    
  
    thisBookList.addEventListener('dblclick', function(event){
      event.preventDefault();
      const image = event.target.offsetParent;
      const bookId = image.getAttribute('data-id');

      favoriteBooks.push(bookId);

      if(favoriteBooks.includes(bookId)){
        image.classList.toggle('favorite');
      }   
    });

    const filterBooks = document.querySelector(select.containerOf.filters);
    filterBooks.addEventListener('click', function(event){
      
      const clickedElem = event.target;

      if(clickedElem.tagName === 'INPUT' && clickedElem.type === 'checkbox' && clickedElem.name === 'filter'){
        if(clickedElem.checked === true){
          filters.push(clickedElem.value);
        } else {
          const valueIndexof = filters.indexOf(clickedElem.value);
          filters.splice(valueIndexof, 1);
        }
        console.log(filters);
        filter();
      }
    });

    const filter = function(){
      console.log('WYWOŁANO MNIE');
      for(let book of dataSource.books){
        const filteredBook  = document.querySelector('.book__image[data-id="' + book.id + '"]');
        let shouldBeHidden = false;

        for(let filter of filters){
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden === true){
          filteredBook.classList.add('hidden');
        } else {
          filteredBook.classList.remove('hidden');
        }
      }
    };
  };

  const determineRatingBgc = function(rating){
    let background = '';
    if(rating < 6){
      background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
    } else if(rating > 6 && rating <= 8) {
      background = 'background: linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
    } else if(rating > 8 && rating <= 9){
      background = 'background: linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
    } else if(rating > 9){
      background = 'background: linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
    }
    return background;
  };
  

  render();
  initActions();
}