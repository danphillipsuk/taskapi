const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./testHelper')

const Project = require('../models/project')

beforeEach(async () => {
  await Project.deleteMany({})
  let projectObject = new Project(helper.initialProjects[0])
  await projectObject.save()
  projectObject = new Project(helper.initialProjects[1])
  await projectObject.save()
})

describe('GET requests', () => {

  test('Projects are returned as JSON', async () => {
    await api
      .get('/api/projects')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('A specific project is returned', async () => {
    const response = await api.get('/api/projects')
    const contents = response.body.map(p => p.content)
    expect(contents).toContain(
      helper.initialProjects[0].content
    )
  })

  test('The correct number of projects are returned', async () => {
    const response = await api.get('/api/projects')
    expect(response.body).toHaveLength(helper.initialProjects.length)
  })

  test('A specific project can be viewed', async () => {
    const projectsAtStart = await helper.projectsInDb()
    const projectToView = projectsAtStart[0]

    const result = await api
      .get(`/api/projects/${projectToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedProjectToView = JSON.parse(JSON.stringify(projectToView))
    expect(result.body).toEqual(processedProjectToView)
  })

})

describe('POST requests', () => {

  test('A new project is successfully added', async () => {

    const newProject = {
      content: 'A new project to test POST',
      important: false,
    }

    await api
      .post('/api/projects')
      .send(newProject)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.projectsInDb()
    expect(response).toHaveLength(helper.initialProjects.length + 1)

    const contents = response.map(p => p.content)
    expect(contents).toContain('A new project to test POST')

  })

  test('An empty project is not added', async () => {

    const prePostCount = await api.get('/api/projects')

    const newProject = {
      important: false,
      date: new Date(),
    }

    await api
      .post('/api/projects')
      .send(newProject)
      .expect(400)

    const response = await helper.projectsInDb()
    expect(response).toHaveLength(prePostCount.body.length)

  })
})


afterAll(() => {
  mongoose.connection.close()
})
