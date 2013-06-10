package com.pearson.chaski.ui.model.collections;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


@Entity
@Table(name = "COLLECTIONASSET")
public class CollectionAsset implements Serializable{
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 2719261452224733605L;
	
	@Id
	@Column(name = "ID")
	@GeneratedValue
	private Integer id;
	
	
	@Column(name = "USERNAME")
	public String username;
	@Column(name = "COLL_NAME")
	public String collectionName;
	@Column(name = "CHASKI_URI")
	public String chaskiURI;
	@Column(name = "ASSET_TYPE")
	public String type;
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "DATE_ADDED")
	public Date addedDate;

	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getCollectionName() {
		return collectionName;
	}
	public void setCollectionName(String collectionName) {
		this.collectionName = collectionName;
	}
	public String getChaskiURI() {
		return chaskiURI;
	}
	public void setChaskiURI(String chaskiURI) {
		this.chaskiURI = chaskiURI;
	}
	public Date getAddedDate() {
		return addedDate;
	}
	public void setAddedDate(Date addedDate) {
		this.addedDate = addedDate;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getType() {
		return type;
	}
	
	
}
