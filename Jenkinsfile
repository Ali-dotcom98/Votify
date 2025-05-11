pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'  // Path to your docker-compose.yml file
        PROJECT_NAME = 'myapp'                      // Project name for docker-compose
    }

    stages {
        stage('Clone Repository') {
            steps {
                
                git 'https://github.com/Ali-dotcom98/Votify.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build the Docker image using docker-compose
                script {
                    sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} build'
                }
            }
        }

        stage('Start Docker Container') {
            steps {
                // Run the Docker container using docker-compose
                script {
                    sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} up -d'
                }
            }
        }

        stage('Verify Running Container') {
            steps {
                script {
                    // Verify that the Docker container is running
                    sh 'docker ps'
                }
            }
        }

        stage('Clean Up') {
            steps {
                // Stop and remove the container after use (optional, but good practice)
                script {
                    sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down'
                }
            }
        }
    }
}
