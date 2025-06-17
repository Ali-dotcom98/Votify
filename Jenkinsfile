pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker compose.yml'  // Path to your docker-compose.yml file
        PROJECT_NAME = 'votify'                     // Docker Compose project name
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
                sh 'git clone https://github.com/Ali-dotcom98/Votify.git /var/lib/jenkins/DevOps/php/'
            }
        }

        stage('Build and Start Docker Compose') {
            steps {
                dir('/var/lib/jenkins/DevOps/php/') {
                    sh 'docker compose -p ${PROJECT_NAME} up -d'
                }
            }
        }

        stage('Verify Running Containers') {
            steps {
                sh 'docker ps'
            }
        }

        stage('Run Tests') {
            steps {
                dir('/var/lib/jenkins/DevOps/') {
                    sh '''
                        echo "🔁 Cloning Testing Repo..."
                        git clone https://github.com/Ali-dotcom98/Testing.git

                        cd Testing

                        echo "📦 Installing Node dependencies..."
                        npm install

                        echo "🧪 Running Automated Tests..."
                        node RunTest.js > test-report.txt

                        echo "✅ Tests completed. Showing summary:"
                        cat test-report.txt
                    '''
                }
            }
        }
    }
}
