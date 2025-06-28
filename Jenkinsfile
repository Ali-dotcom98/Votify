pipeline {
    agent any
    environment {
        DOCKER_COMPOSE_FILE = 'docker compose.yml'
        PROJECT_NAME = 'votify'
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
                    sh 'docker compose -p votify up -d'
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
                        set -e

                        echo "🧹 Cleaning up existing Testing folder..."
                        rm -rf Testing

                        echo "🔁 Cloning Testing Repo..."
                        git clone https://github.com/Ali-dotcom98/Testing.git

                        cd Testing

                        echo "📦 Installing Node dependencies..."
                        npm install

                        echo "🧪 Running Automated Tests..."
                        node RunTest.js

                        echo "✅ Tests completed. Showing summary:"
                        cat test-report.txt
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                def email = sh(
                    script: "cd /var/lib/jenkins/DevOps/php && git show -s --format='%ae' HEAD",
                    returnStdout: true
                ).trim()

                def reportContent = readFile('/var/lib/jenkins/DevOps/Testing/test-report.txt')

                emailext(
                    to: "${email}",
                    subject: "🧪 Test Report: Jenkins Job #${env.BUILD_NUMBER}",
                    body: """
Hello,

The automated tests for Jenkins job "${env.JOB_NAME}" (Build #${env.BUILD_NUMBER}) have completed.

📊 Test Summary:
--------------------------------------------------
${reportContent}
--------------------------------------------------

Regards,
Jenkins Team
                    """,
                    mimeType: 'text/plain'
                )
            }
        }
    }
}
