package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"
	"math/rand"
	"log"

	"github.com/gorilla/mux"
)

// Ingredients struct
type Ingredients struct {
	Salad  int `json:"salad"`
	Bacon  int `json:"bacon"`
	Cheese int `json:"cheese"`
	Meat   int `json:"meat"`
}

// Address struct
type Address struct {
	Street  string `json:"street"`
	ZipCode string `json:"zipCode"`
	Country string `json:"country"`
}

// Customer struct
type Customer struct {
	Name    string  `json:"name"`
	Address Address `json:"address"`
	Email   string  `json:"email"`
}

type Order struct {
	Ingredients    Ingredients `json:"ingredients"`
	Price          float64     `json:"price"`
	Customer       Customer    `json:"customer"`
	DeliveryMethod string      `json:"deliveryMethod"`
}

var Orders = map[string]Order{}

func main() {
	//fillPosts("posts.json")
	r := mux.NewRouter()
	r.HandleFunc("/ingredients", handlerIngredients).Methods("GET")
	r.HandleFunc("/orders", handlerOrder).Methods("POST", "OPTIONS", "GET")
	r.HandleFunc("/posts/{id}", handlerFullPost).Methods("GET", "DELETE")
	r.NotFoundHandler = http.HandlerFunc(notFound)
	//http.HandleFunc("/posts", handlerIngredients)
	http.ListenAndServe(":3030", r)
}

func fillPosts(fileName string) []string {
	// Open our jsonFile
	jsonFile, err := os.Open(fileName)
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)

	posts := make([]string, 0)
	json.Unmarshal(byteValue, &posts)
	return posts
}

func handlerIngredients(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received request" + r.Method)
	time.Sleep(time.Second * 2)
	ingredients := Ingredients{0, 0, 0, 0}

	js, err := json.Marshal(ingredients)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	w.Write(js)
}

func handlerOrder(w http.ResponseWriter, r *http.Request) {

	time.Sleep(time.Second * 2)
	//vars := mux.Vars(r)
	if r.Method == "OPTIONS" {
		fmt.Println("Received request options")
		w.Header().Set("Allow", "OPTIONS, GET, POST")
		w.Header().Set("Accept", "text/html, application/json")
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == "GET" {
		js, err := json.Marshal(Orders)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusOK)
		w.Write(js)

		return
	}

	fmt.Println("Received request post")
	err := r.ParseForm()
	if err != nil {
		fmt.Println("Error parsing form ", err)
	}
	fmt.Println((r))
	fmt.Println("-----------------")

	data := Order{}

	for key := range r.Form {
		fmt.Println(key)
		json.Unmarshal([]byte(key), &data)
		fmt.Println("+++++++++")
		fmt.Println(data)
		Orders[generateID()] = data
	}

	fmt.Println("Here")

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusCreated)
	return
}
func notFound(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Not found!!!")
	w.WriteHeader(http.StatusNotFound)
}
func handlerFullPost(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	id, _ := vars["id"]
	posts := fillPosts("posts.json")

	for _, post := range posts {
		if post == id {
			js, err := json.Marshal(post)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.WriteHeader(http.StatusOK)
			w.Write(js)
			return
		}

	}
	w.WriteHeader(http.StatusNotFound)

}

func generateID() string {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		log.Fatal(err)
	}
	return fmt.Sprintf("%x", b)
}
