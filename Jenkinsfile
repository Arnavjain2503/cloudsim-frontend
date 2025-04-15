pipeline {
    agent { label 'Slave-frontend' }

    environment {
        DOCKER_IMAGE = 'React-cloudsim-app'
        DOCKER_TAG = 'latest'
        CONTAINER_NAME = 'React-cloudsim-container'
        FRONTEND_PATH = 'frontend' // Specify the path to the frontend folder containing Dockerfile
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Checking out code using SSH...'
                    checkout scm
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // Specify the context (frontend folder) and the path to Dockerfile
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -f ${FRONTEND_PATH}/Dockerfile ${FRONTEND_PATH}"
            }
        }

        stage('Stop and Remove Existing Container') {
            steps {
                script {
                    sh "docker ps -a -q --filter 'name=${CONTAINER_NAME}' | xargs -r docker stop"
                    sh "docker ps -a -q --filter 'name=${CONTAINER_NAME}' | xargs -r docker rm"
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                sh "docker run -d -p 5000:5000 --name ${CONTAINER_NAME} ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed. Please check the logs.'
        }
    }
}
