pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'  // Path to your docker-compose.yml file
        PROJECT_NAME = 'votify'                 // Docker Compose project name
    }

    stages {
        stage('Delete DevOps Folder if It Exists') {
            steps {
                sh '''
                if [ -d "/var/lib/jenkins/DevOps/" ]; then
                    find "/var/lib/jenkins/DevOps/" -mindepth 1 -delete
                    echo "Contents of /var/lib/jenkins/DevOps/ have been removed."
                else
                    echo "Directory /var/lib/jenkins/DevOps/ does not exist."
                fi
                '''
            }
        }

        stage('Fetch Code') {
            steps {
                // Clone the GitHub repository to the DevOps directory
                sh 'git clone https://github.com/Ali-dotcom98/Votify.git /var/lib/jenkins/DevOps/php/'
            }
        }

        stage('Build and Start Docker Compose') {
            steps {
                dir('/var/lib/jenkins/DevOps/php/') {
                    // Build and start the containers using Docker Compose
                    sh 'docker compose -p ${PROJECT_NAME} up -d'
                }
            }
        }

        stage('Verify Running Containers') {
            steps {
                // Verify that the containers are running
                script {
                    sh 'docker ps'
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    // Optionally stop and remove the containers after the process is done
                    sh 'docker compose -p ${PROJECT_NAME} down'
                }
            }
        }
    }
}
