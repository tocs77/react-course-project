package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

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

//UserAuthData authentication data
type UserAuthData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

//Order structure
type Order struct {
	Ingredients    Ingredients `json:"ingredients"`
	Price          float64     `json:"price"`
	Customer       Customer    `json:"customer"`
	DeliveryMethod string      `json:"deliveryMethod"`
	UserID         string      `json:"userId"`
}

// AuthResponse struct
type AuthResponse struct {
	LocalID   string `json:"localId"`
	IDToken   string `json:"idToken"`
	ExpiresIn string `json:"expiresIn"`
}

//Orders to keep orders
var Orders = map[string]Order{}

//Users Data
var Users = map[string]UserAuthData{}

//Tokens keep authorisation tokens
var Tokens = map[string]string{}

func main() {
	//fillPosts("posts.json")
	r := mux.NewRouter()
	r.HandleFunc("/ingredients", handlerIngredients).Methods("GET")
	r.HandleFunc("/orders", handlerOrder).Methods("POST", "OPTIONS", "GET")
	r.HandleFunc("/signupuser", handlerSignup).Methods("POST")
	r.HandleFunc("/signinuser", handlerSignin).Methods("POST")
	r.HandleFunc("/posts/{id}", handlerFullPost).Methods("GET", "DELETE")
	r.NotFoundHandler = http.HandlerFunc(notFound)
	//http.HandleFunc("/posts", handlerIngredients)
	fmt.Print("Started")
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

	w.Header().Set("Access-Control-Allow-Origin", "*")
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
		params := r.URL.Query()
		authToken := params["auth"][0]
		_, found := Tokens[authToken]
		if !found {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		js, err := json.Marshal(Orders)
		//err := json.NewEncoder(w).Encode(Orders)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

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

func handlerSignup(w http.ResponseWriter, r *http.Request) {
	id := generateID()

	log.Println("log up handler")

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	err := r.ParseForm()
	if err != nil {
		fmt.Println("Error parsing form ", err)
	}

	data := UserAuthData{}

	for key := range r.Form {
		fmt.Println(key)
		json.Unmarshal([]byte(key), &data)
		fmt.Println(data)
	}
	for key := range Users {
		if Users[key].Email == data.Email {
			js, _ := json.Marshal(map[string]string{"Message": "User exists"})
			w.WriteHeader(http.StatusBadRequest)
			w.Write(js)
			return
		}
	}
	Users[id] = data

	js, _ := json.Marshal(map[string]string{"Id": id})
	w.Write(js)
	//w.WriteHeader(http.StatusOK)
}

func handlerSignin(w http.ResponseWriter, r *http.Request) {
	log.Println("Login hadler")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	err := r.ParseForm()
	if err != nil {
		fmt.Println("Error parsing form ", err)
	}

	data := UserAuthData{}

	for key := range r.Form {
		json.Unmarshal([]byte(key), &data)
		//fmt.Println(data)
	}
	for key := range Users {
		if Users[key].Email == data.Email {
			if Users[key].Password == data.Password {
				token := generateID() + generateID()
				Tokens[token] = key
				ar := AuthResponse{key, token, "3600"}

				js, err := json.Marshal(ar)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				fmt.Println(js)
				w.WriteHeader(http.StatusOK)
				w.Write(js)
				return
			}

		}
	}
	w.WriteHeader(http.StatusBadRequest)
}

func generateID() string {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		log.Fatal(err)
	}
	return fmt.Sprintf("%x", b)
}
