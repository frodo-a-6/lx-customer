plugins {
    id("org.springframework.boot") version "3.2.3"
    id("io.spring.dependency-management") version "1.1.4"
    java
    kotlin("jvm") version "2.1.20"
}

group = "com.lx.customer"
version = "0.0.1-SNAPSHOT"

repositories {
    mavenCentral()
}

@Suppress("unused")
val jaxwsTools: Configuration? by configurations.creating

dependencyManagement {
    imports {
        mavenBom("io.awspring.cloud:spring-cloud-aws-dependencies:3.1.0")
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.postgresql:postgresql")
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    implementation("com.sun.xml.ws:jaxws-ri:3.0.2")
    implementation("jakarta.xml.ws:jakarta.xml.ws-api:3.0.0")
    implementation("jakarta.xml.bind:jakarta.xml.bind-api:3.0.1")
    implementation("org.glassfish.jaxb:jaxb-runtime:3.0.2")
    add("jaxwsTools", "com.sun.xml.ws:jaxws-tools:3.0.2")
    implementation("io.awspring.cloud:spring-cloud-aws-starter-secrets-manager:3.1.0")
    implementation("com.amazonaws.secretsmanager:aws-secretsmanager-jdbc:2.0.2")
    implementation("com.google.code.gson:gson")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testCompileOnly("org.projectlombok:lombok")
    testAnnotationProcessor("org.projectlombok:lombok")
    implementation(kotlin("stdlib-jdk8"))
}

tasks.named<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}

tasks.withType<Test> {
    useJUnitPlatform()
}

val generateSoapClient by tasks.registering(JavaExec::class) {
    val outputDir = layout.buildDirectory.dir("generated-sources/wsdl")
    doFirst {
        outputDir.get().asFile.mkdirs()
    }
    mainClass.set("com.sun.tools.ws.WsImport")
    classpath = configurations["jaxwsTools"]
    args = listOf(
        "-s", outputDir.get().asFile.absolutePath,
        "-p", "eu.europa.ec.taxation_customs.vies.checkVat",
        "https://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl"
    )
}

sourceSets["main"].java.srcDir(layout.buildDirectory.dir("generated-sources/wsdl").get().asFile)
tasks.named("compileJava") {
    dependsOn(generateSoapClient)
}
kotlin {
    jvmToolchain(21)
}