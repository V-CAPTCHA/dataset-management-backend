pipeline {
    agent any

    stages {
        stage('Git Clone') {
            steps {
                cleanWs()
                git branch: 'main',url: 'https://github.com/V-CAPTCHA/dataset-management-backend.git'
                sh 'cp /var/lib/jenkins/workspace/env/dataset-management-backend/.env ./.env'
            }
        }
        stage('SonarQube Analysis') {
            environment {
            scannerHome = tool 'SonarLocal'
        }
            steps{
               withSonarQubeEnv('SonarLocal') {
                   sh "${scannerHome}/bin/sonar-scanner"
}
        }
        }
                stage('Docker PreBuild Clear old image') {
            steps {
                
                sh 'docker stop dataset_management_backend || true && docker rm dataset_management_backend || true'
                sh 'docker image rm dataset_management_backend || true'
            }
        }
                stage('Docker Build') {
            steps {
                sh 'mkdir uploads'
                sh 'docker build . -t dataset_management_backend' 
            }
        }
                stage('Docker Deploy') {
            steps {
                
                sh 'docker run -p 5000:3000/tcp --restart=always -d --name dataset_management_backend dataset_management_backend:latest'
            }
        }
    }
}
