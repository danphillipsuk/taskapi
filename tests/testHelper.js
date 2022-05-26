const Project = require('../models/project')

const initialProjects = [
  {
    content: 'Test one created note',
    date: new Date(),
    important: true,
  },
  {
    content: 'Test two created note',
    date: new Date(),
    important: false,
  }
]

const projectsInDb = async () => {
  const projects = await Project.find({})
  return projects.map(project => project.toJSON())
}

module.exports = {
  initialProjects,
  projectsInDb
}