const Movie = require('../models/movie');
const BadRequestError = require('../errors/400-bad-req');
const NotFoundError = require('../errors/404-notfound');
const ForbiddenError = require('../errors/403-forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res
      .send({
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: movie.thumbnail,
        movieId: movie.movieId,
        _id: movie._id,
        owner: movie.owner,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;

  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (userId !== movie.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие фильмы');
      }

      Movie.findByIdAndRemove(req.params.movieId)
        .then((movieToDelete) => {
          res.send(`Фильм ${movieToDelete.nameRU} удален`);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении фильма'));
      }
      next(err);
    });
};
