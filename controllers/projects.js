const projectsRouter = require('express').Router()
const Project = require('../models/project')

projectsRouter.get('/', async (request, response) => {
  const projects = await Project.find({})
  response.json(projects)
})

projectsRouter.get('/:id', async (request, response) => {
  const project = await Project.findById(request.params.id)
  if (project) {
    response.json(project)
  } else {
    response.status(404).end()
  }
})

projectsRouter.post('/', async (request,response) => {
  const body = request.body

  const project = new Project ({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  const savedProject = await project.save()
  response.status(201).json(savedProject)
})

projectsRouter.delete('/:id', async (request, response) => {
  await Project.findByIdAndRemove(request.params.id)
  response.status(204).end()
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