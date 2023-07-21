package serverResponse

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// Creates a response with given message and data
func HandleSuccess(c *gin.Context, message string) {
	c.JSON(http.StatusOK, map[string]interface{}{"Score": message, "Status": true, "Message": "SUCCESS"})
}

// Creates a response with given message and data
func HandleFail(c *gin.Context, message string) {
	c.JSON(http.StatusNotAcceptable, map[string]interface{}{"Score": "NaN", "Status": false, "Message": message})
}
