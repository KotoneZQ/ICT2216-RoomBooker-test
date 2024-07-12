pipeline {
    agent {
        docker {
            image 'myjenkins-blueocean:2.452.1-1'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKER_COMPOSE_FILE = '/var/jenkins_home/workspace/RoomBooker/docker-compose.yml'
        DOCKER_HOST = 'unix:///var/run/docker.sock'
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = credentials('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
        STRIPE_SECRET_KEY = credentials('STRIPE_SECRET_KEY')
        admin_email = credentials('admin_email')
        admin_password = credentials('admin_password')
        FRONTEND_BASE_URL = 'https://roombooker.zapto.org'
        BACKEND_API_URL = credentials('BACKEND_API_URL')
        NEXT_PUBLIC_SESSION_PASSWORD = credentials('NEXT_PUBLIC_SESSION_PASSWORD')
        DB_USERNAME = credentials('DB_USERNAME')
        DB_PASSWORD = credentials('DB_PASSWORD')
        DB_HOST = credentials('DB_HOST')
        DB_NAME = credentials('DB_NAME')
        DB_PORT = credentials('DB_PORT')
        SONARQUBE_SCANNER = tool 'SonarQubeScanner'
        SONARQUBE_TOKEN = credentials('SONARQUBE_TOKEN')
        SONARQUBE_PROJECT_KEY = credentials('SONARQUBE_PROJECT_KEY')
        SONARQUBE_URL = credentials('SONARQUBE_URL')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    git branch: 'main', credentialsId: 'gh', url: 'https://github.com/aloysiustayy/ICT2216-RoomBooker.git'
                    sh '''
                    ls -lart ./*
                    echo Hello World
                    '''
                }
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    sh 'docker compose -f ${DOCKER_COMPOSE_FILE} down'
                    sh 'docker compose -f ${DOCKER_COMPOSE_FILE} build --no-cache fastapi'
                    sh 'docker compose -f ${DOCKER_COMPOSE_FILE} build nextjs'
                    sh 'docker compose -f ${DOCKER_COMPOSE_FILE} up -d' 
                }
            }
        }

        stage('OWASP Dependency-Check Vulnerabilities') {
            steps {
                dependencyCheck additionalArguments: ''' 
                            --enableExperimental
                            -o './'
                            -s './'
                            -f 'ALL' 
                            --prettyPrint''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                        ${SONARQUBE_SCANNER}/bin/sonar-scanner \
                        -Dsonar.projectKey=${SONARQUBE_PROJECT_KEY} \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONARQUBE_URL} \
                        -Dsonar.token=${SONARQUBE_TOKEN} 
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            script {
                sh 'docker builder prune -f'
            }
        }
    }
}
