const projectsRouter = require('express').Router()
const Project = require('../models/project')

projectsRouter.get('/', (request, response) => {
  Project.find({}).then(projects => {
    response.json(projects)
  })
})

projectsRouter.get('/:id', (request, response, next) => {
  Project.findById(request.params.id)
    .then(project => {
      if (project) {
        response.json(project)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

projectsRouter.post('/', (request,response, next) => {
  const body = request.body

  const project = new Project ({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  project.save()
    .then(savedProject => {
      response.json(savedProject)
    })
    .catch(error => next(error))
})

projectsRouter.delete('/:id', (request, response, next) => {
  Project.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

projectsRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Project.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedProject => {
      response.json(updatedProject)
    })
    .catch(error => next(error))
})


module.exports = projectsRouter