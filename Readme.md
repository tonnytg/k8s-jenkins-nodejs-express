# K8S with Jenkins

### What do you need?
- Minikube
- Docker
- kubectl
- Helm
- k9s (optional)

### Config Minikube

First you need to install and configure `minikube`
> minikube start --cpus 4 --memory 8048 --disk-size=20g --addons=ingress --vm=true
<br/>
  

## First steps after minikube running
  

#### Create a Jenkins

Go to k8s folder inside this project
> cd k8s
  
Create namespace for Jenkins, Prod and Dev

> kubectl create -f namespaces.yml

> helm install jenkins -n jenkins -f jenkins-values.yaml jenkinsci/jenkins

With this you have now a Jenkins inside a namespace jenkins to build your pipeline
Follow the instructions of `helm` output to get Jenkins admin password 
  

#### Create service NodePort for Jenkins

Inside k8s folder, deploy services for access jenkins
> kubectl create -f jenkins-service.yml -n jenkins

If you want check
> kubectl get svc -n jenkins

### Configure kubectl on Jenkins pod

```
kubectl exec -n jenkins -it $(kubectl get pods -n jenkins | tail -n1 | tr -s " " | cut -d" " -f1) -- bash
```
Go to home of jenkins and create a folder for kubectl config
> cd /var/jenkins_home

> mkdir .kube

Inside jenkins home, download kubect
```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

> chmod +x kubectl

At this momento your kubectl don't work, because you need key of k8s cluster.
Exit jenkins pod and back your machine.
<br/>
<br/>

### Config and CA Jenkins
<br/>



> kubectl cp ~/.minikube/ca.crt jenkins/jenkins-0:/var/jenkins_home/.kube/

> kubectl cp ~/.minikube/profiles/minikube/client.key jenkins/jenkins-0:/var/jenkins_home/.kube/

> kubectl cp ~/.minikube/profiles/minikube/client.crt jenkins/jenkins-0:/var/jenkins_home/.kube/



Now we need config file, but you need edit a PATH of files, create a copy of your config, edit and after send to jenkins.

In your machine, copy file
> cp ~/.kube/config ~/.kube/config-jenkins
<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/config%20user.png" width="600" height="500">

Edit file
> vim ~/.kube/config-jenkins

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/config%20jenkins.png" width="600" height="500">

Edit PATH of lines ca.crt, client.key and client.crt to /var/jenkins_home/
Now send this config-jenkins to POD

> kubectl cp ~/.kube/config-jenkins jenkins/jenkins-0:/var/jenkins_home/.kube/config



Nice!
Now your Jenkins ready to use kubectl

If you wanna check:
```
kubectl exec -n jenkins -it $(kubectl get pods -n jenkins | tail -n1 | tr -s " " | cut -d" " -f1) -- bash
```

> /var/jenkins_home/kubectl get all



## Access your Jenkins Web Console

To access, follow next command to get URL and PORT:
```
echo "http://`minikube ip`:`kubectl get all -n jenkins | grep jenkins-service | tr -s " " | cut -d" " -f5 | cut -d":" -f2 | cut -d"/" -f1`"
```
Access this link on your browser.


#### To login:
User: admin

Password: >>To get password run this command bellow.<<
```
kubectl exec --namespace jenkins -it svc/jenkins -c jenkins -- /bin/cat /run/secrets/chart-admin-password && echo
```
The password return like this:

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/jenkins%20password.png" width="1000" height="35">


## Configure your jenkins


### Configure your Node executor or Master jenkins (Choose what you like)

#### Build with Master (more faster)
1. Go to >> Manager Jenkins >> Manage Nodes and Cloud >> Configure Clouds
2. Remove cloud `kubernetes`

##### Configure Master to recive jobs (first way)
1. Go to >> Manager Jenkins >> Manage Nodes and Cloud
2. Click configure on `master` 
3. Change `# of executors: 0` to 5 or more
<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/master_jobs.png" width="400" height="400">

#### Build with Node Container on Kubernetes (second way)
This process it use kubernetes plugin on jenkins to build a POD and execute pipeline
https://plugins.jenkins.io/kubernetes/


#### Build your job to run on executor
2. Create New Item
3. Create a **pipeline** with name `build app k8s`
4. Go to Pipeline and paste [k8s/jenkinsfile content](https://raw.githubusercontent.com/tonnytg/k8s-jenkins-nodejs-express/master/k8s/jenkinsfile), like this image:

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/jenkinsfile.png" width="1000" height="400">

5. Save
6. Build yout test

Example of jobs working:

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/build%20pipeline.png" width="1000" height="500">


## Example application

1. First yout need deploy your database to listen 27017
2. After deploy your app in Nodejs to get some data on mongodb-service

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/check%20deploy%20dev_prod.png" width="700" height="100">

