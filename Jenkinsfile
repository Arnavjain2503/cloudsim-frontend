pipeline {
    agent { label 'Slave-frontend' }

    environment {
        DOCKER_IMAGE = 'react-cloudsim-app'  // Use lowercase for the image name
        DOCKER_TAG = 'latest'
        CONTAINER_NAME = 'react-cloudsim-container'  // Use lowercase for the container name
        FRONTEND_PATH = 'frontend' // Path to the frontend folder containing Dockerfile
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
                sh "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} ${DOCKER_IMAGE}:${DOCKER_TAG}"
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
