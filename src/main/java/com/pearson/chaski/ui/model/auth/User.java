package com.pearson.chaski.ui.model.auth;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Class to represent a user in a database
 * @author Cdavidson
 *
 */
@Entity
@Table(name = "USER")
public class User implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1924351419276154580L;
	@Id
	@Column(name = "USERNAME")
	String username;
	@Column(name = "EMAIL")
	String emailAddress;
	
	public User(){
		
	}
	
	public User(String username, String emailAddress) {
		this.username = username;
		this.emailAddress = emailAddress;
	}
	public String getEmailAddress() {
		return emailAddress;
	}
	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	
	
	
}
