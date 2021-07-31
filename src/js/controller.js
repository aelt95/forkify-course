//Imports

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js'
import recipeView from './views/recipeviews.js'
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkview from './views/bookmarkview.js';
import addrecepiView from './views/addrecepiView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

/*if (module.hot){
  module.hot.accept();
}*/



const controlRecipe = async function(){
  try{
    const id = window.location.hash.slice(1)

    if (!id) return;
    recipeView.renderSpinner()

    //0. Update result view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    bookmarkview.update(model.state.bookmarks)
    //Load recipe
    await model.loadRecipe(id)

    //Rendering recipe
    recipeView.render(model.state.recipe)

  
  }catch(err){
    recipeView.renderError()
  }

}

const controlSearchResult = async function(){
  try{
    //Spinner
    resultView.renderSpinner();



    //GetQueryfromSearch
    const query = searchView.getQuery()
    if(!query) return;

    //Load search result
    await model.loadSearchResults(query)

    //RenderResults
    console.log(model.state.search.result)
    resultView.render(model.getSearchResultsPage())

    //render pagination
    paginationView.render(model.state.search)
  }catch (err){
    console.log(err)
  }
}


const controlPagination = function (goToPage){
  if(!goToPage) return

  resultView.render(model.getSearchResultsPage(goToPage))
  paginationView.render(model.state.search)

}

const controlServings = function (newServings){
  //Update the recipe servings (in state)
  model.uptadeServings(newServings);

  //Uptade the view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe)

}

const controlAddBookmark = function (){
  //1 ADD/REMOVE BOOKMARK
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id)
  console.log(model.state.recipe)
  //Update
  recipeView.update(model.state.recipe)
  //RenderBookmarks 
  bookmarkview.render(model.state.bookmarks)
}

const controlBookmarks = function (){
  bookmarkview.render(model.state.bookmarks)
}

const controlAddrecipe = async function(newRecipe){
  try{
    addrecepiView.renderSpinner()

    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)

    //Render
    recipeView.render(model.state.recipe);

    //CloseForm
    setTimeout(function(){
      addrecepiView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)

    //Success message
    addrecepiView.renderMessage();

    //Render bookmark
    bookmarkview.render(model.state.bookmarks)

    //Change ID in URL
    window.history.pushState(null,"",`#${model.state.recipe.id}`)
    

  }catch (err){
    console.error("💣")
    addrecepiView.renderError(err.message)
  }
  

}
const init = function(){
  bookmarkview.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHanlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmarke(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addrecepiView.addHandlerUpload(controlAddrecipe);
  console.log("welcome")
}
init()